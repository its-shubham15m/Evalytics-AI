import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../utils/api';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { AlertTriangle, Loader, PlayCircle, Check, X } from 'lucide-react';

// --- Reusable UI Components ---

const ProctoringFlag = ({ text }) => (
    <div className="flex items-center bg-yellow-900/50 p-2 rounded-md text-sm">
        <AlertTriangle size={16} className="text-yellow-400 mr-2 flex-shrink-0" />
        <span>{text}</span>
    </div>
);

const FullScreenLobby = ({ onStart }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-2">You are about to begin the exam.</h1>
            <p className="text-gray-400 mb-6">This will be a fullscreen, proctored session.</p>
            <button
                onClick={onStart}
                className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500"
            >
                <PlayCircle className="mr-2" />
                Begin Exam
            </button>
        </div>
    </div>
);

const LoadingSpinner = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <Loader className="animate-spin mb-4" size={48} />
        {text}
    </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
     <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-center text-gray-300 mb-6">{message}</p>
        <button onClick={onRetry} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
            Return to Dashboard
        </button>
    </div>
);


// --- Code Runner Component (with Base64 fix) ---

const CodeRunner = ({ question, code, onCodeChange }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState([]);

    const handleRunCode = async () => {
        setIsSubmitting(true);
        setTestResults([]);
        try {
            // ✅ FIX: Base64 encode the source code before sending to the backend.
            const encodedCode = btoa(code);
            
            const { data } = await api.post('/exams/run-code', {
                source_code: encodedCode,
                language_id: 71, // Python
                test_cases: question.test_cases.filter(tc => !tc.hidden)
            });
            setTestResults(data.results);
        } catch (error) {
            console.error("Error running code:", error);
            const errorMessage = error.response?.data?.detail || 'Failed to run code.';
            setTestResults([{ status: { description: 'Error' }, stderr: btoa(errorMessage) }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border border-gray-700 rounded-lg overflow-hidden flex-grow">
                <Editor height="100%" language="python" theme="vs-dark" value={code} onChange={onCodeChange} options={{ minimap: { enabled: false } }} />
            </div>
            <div className="mt-4">
                <button onClick={handleRunCode} disabled={isSubmitting} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                    {isSubmitting ? 'Running...' : 'Run Tests'}
                </button>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg flex-grow overflow-y-auto h-32">
                <h4 className="font-semibold mb-2">Test Cases</h4>
                {testResults.length > 0 ? (
                    <div className="space-y-2">
                        {testResults.map((result, index) => (
                            <div key={index} className={`p-2 rounded-md ${result.status.description === 'Accepted' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                <div className="flex items-center font-semibold">
                                    {result.status.description === 'Accepted' ? <Check size={16} className="text-green-400 mr-2" /> : <X size={16} className="text-red-400 mr-2" />}
                                    Test Case #{index + 1}: {result.status.description}
                                </div>
                                {result.stderr && <pre className="text-xs text-red-300 mt-1 pl-6 whitespace-pre-wrap">{atob(result.stderr)}</pre>}
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-500">Run code to see test case results.</p>}
            </div>
        </div>
    );
};


// --- Main Exam Component ---

const ExamEnvironment = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    
    // State
    const [exam, setExam] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questionStatuses, setQuestionStatuses] = useState({});
    const [examStarted, setExamStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [proctoringFlags, setProctoringFlags] = useState([]);

    // Refs
    const intervalsRef = useRef({ proctoring: null, timer: null });
    const webcamRef = useRef(null);
    const modelRef = useRef(null);

    // Handlers
    const updateStatus = useCallback((index, newStatus) => {
        setQuestionStatuses(prev => ({ ...prev, [index]: newStatus }));
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        const currentStatus = questionStatuses[currentQuestionIndex];
        if (answer && (currentStatus === 'notAnswered' || currentStatus === 'notVisited')) {
            updateStatus(currentQuestionIndex, 'answered');
        }
    };

    const navigateQuestion = (index) => {
        if (index >= 0 && exam && index < exam.questions.length) {
            setCurrentQuestionIndex(index);
            if (questionStatuses[index] === 'notVisited') {
                updateStatus(index, 'notAnswered');
            }
        }
    };

    const handleSaveAndNext = () => navigateQuestion(currentQuestionIndex + 1);
    
    const handleClearResponse = () => {
        const currentQuestionId = exam?.questions[currentQuestionIndex]?.id;
        if (currentQuestionId) {
            setAnswers(prev => ({ ...prev, [currentQuestionId]: '' }));
            updateStatus(currentQuestionIndex, 'notAnswered');
        }
    };

    const handleMarkForReview = () => {
        const currentStatus = questionStatuses[currentQuestionIndex];
        updateStatus(currentQuestionIndex, currentStatus === 'answered' ? 'answeredAndMarked' : 'marked');
        navigateQuestion(currentQuestionIndex + 1);
    };

    const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
        if (!sessionId) {
            alert("Exam session not initialized. Cannot submit.");
            return;
        }

        clearInterval(intervalsRef.current.proctoring);
        clearInterval(intervalsRef.current.timer);
        window.onbeforeunload = null;

        try {
            console.log("Submitting exam:", { sessionId, answers });

            // FIXED: Send session_id in the request body
            const { data } = await api.post('/exams/submit', { 
                session_id: sessionId, 
                answers: answers 
            });

            if (!isAutoSubmit) alert(`Exam submitted successfully! Score: ${data.score}%`);
            navigate('/dashboard/results');
        } catch (error) {
            console.error("Failed to submit exam:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to submit exam.';
            if (!isAutoSubmit) alert(`Error submitting exam: ${errorMessage}`);
        }
    }, [sessionId, answers, navigate]);

    // Effects
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.setBackend('webgl');
                modelRef.current = await cocoSsd.load();
                console.log("Proctoring model loaded.");
            } catch (err) {
                console.error("Failed to load TF model", err);
            }
        };
        loadModel();
    }, []);

    // --- Exam start effect ---
    useEffect(() => {
        if (!examStarted) return;

        const startExamFlow = async () => {
            setLoading(true);
            try {
                const [examRes, sessionRes] = await Promise.all([
                    api.get(`/exams/${examId}`),
                    api.post(`/exams/start/${examId}`)
                ]);

                console.log("Exam data:", examRes.data);
                console.log("Start exam response:", sessionRes.data);

                if (!sessionRes.data?.session_id) {
                    throw new Error("Session ID not returned from backend.");
                }

                setExam(examRes.data);
                setTimeLeft(examRes.data.duration_minutes * 60);
                setSessionId(sessionRes.data.session_id);

                const initialStatuses = {};
                examRes.data.questions.forEach((_, index) => {
                    initialStatuses[index] = index === 0 ? 'notAnswered' : 'notVisited';
                });
                setQuestionStatuses(initialStatuses);
            } catch (err) {
                console.error(err);
                setError("Could not start the exam.");
            } finally {
                setLoading(false);
            }
        };

        startExamFlow();
    }, [examId, examStarted]);

    // --- Timer effect (run only after sessionId is ready) ---
    useEffect(() => {
        if (!sessionId) return; // do not run timer/proctoring until session exists

        const runProctoring = async () => {
            if (webcamRef.current?.video?.readyState === 4 && modelRef.current) {
                const predictions = await modelRef.current.detect(webcamRef.current.video);
                const personCount = predictions.filter(p => p.class === 'person').length;
                const flagTime = new Date().toLocaleTimeString();
                if (personCount === 0) setProctoringFlags(prev => [...prev, `${flagTime}: No person detected.`]);
                else if (personCount > 1) setProctoringFlags(prev => [...prev, `${flagTime}: Multiple people detected (${personCount}).`]);
            }
        };

        intervalsRef.current.timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalsRef.current.timer);
                    handleSubmitExam(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        intervalsRef.current.proctoring = setInterval(runProctoring, 8000);

        window.onbeforeunload = (e) => {
            handleSubmitExam(true);
            e.preventDefault();
            e.returnValue = 'Your progress will be submitted automatically if you leave.';
        };

        return () => {
            clearInterval(intervalsRef.current.timer);
            clearInterval(intervalsRef.current.proctoring);
            window.onbeforeunload = null;
        };
    }, [sessionId, handleSubmitExam]);

    
    // --- Render Logic ---
    const getStatusInfo = (status) => {
        switch (status) {
            case 'answered': return { color: 'bg-green-500', text: 'Answered' };
            case 'notAnswered': return { color: 'bg-red-500', text: 'Not Answered' };
            case 'notVisited': return { color: 'bg-gray-600', text: 'Not Visited' };
            case 'marked': return { color: 'bg-purple-500', text: 'Marked for Review' };
            case 'answeredAndMarked': return { color: 'bg-blue-500', text: 'Answered & Marked' };
            default: return { color: 'bg-gray-600', text: 'Not Visited' };
        }
    };

    if (!examStarted) return <FullScreenLobby onStart={() => setExamStarted(true)} />;
    if (loading) return <LoadingSpinner text="Loading Exam..." />;
    if (error) return <ErrorDisplay message={error} onRetry={() => navigate('/dashboard')} />;
    if (!exam) return <LoadingSpinner text="Preparing exam environment..." />;

    const currentQuestion = exam.questions[currentQuestionIndex];
    const statusCounts = Object.values(questionStatuses).reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    
    return (
        <div className="flex h-screen bg-black text-white p-4 gap-4 font-sans">
            {/* Left Panel */}
            <div className="flex-1 flex flex-col bg-gray-900 rounded-lg p-6">
                <h1 className="text-xl font-bold mb-4">{exam.title}</h1>
                <div className="border-t border-gray-700 pt-4 flex-grow overflow-y-auto">
                    <p className="font-semibold mb-3">Question {currentQuestionIndex + 1}:</p>
                    <p className="mb-4 whitespace-pre-wrap">{currentQuestion.text}</p>
                    {currentQuestion.question_type === 'mcq' ? (
                        <div className="space-y-3">
                            {currentQuestion.options.map((opt, i) => (
                                <label key={i} className="flex items-center bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700">
                                    <input type="radio" name={currentQuestion.id} value={opt} checked={answers[currentQuestion.id] === opt} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} className="form-radio h-4 w-4 text-blue-500"/>
                                    <span className="ml-3">{opt}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <CodeRunner 
                            question={currentQuestion}
                            code={answers[currentQuestion.id] || ''}
                            onCodeChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        />
                    )}
                </div>
                <div className="border-t border-gray-700 mt-4 pt-4 flex items-center justify-between">
                    <div>
                        <button onClick={handleSaveAndNext} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg mr-2">Save & Next</button>
                        <button onClick={handleMarkForReview} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">Mark for Review & Next</button>
                    </div>
                    <button onClick={handleClearResponse} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">Clear Response</button>
                </div>
            </div>
            {/* Right Panel */}
            <div className="w-80 flex-shrink-0 bg-gray-900 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Time Left</p>
                        <p className="font-bold text-xl text-red-400">{new Date(timeLeft * 1000).toISOString().substr(11, 8)}</p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 font-bold py-2 px-6 rounded-lg" onClick={() => { if(window.confirm('Are you sure you want to submit the exam?')) handleSubmitExam()}}>
                        Submit
                    </button>
                </div>
                <div className="bg-gray-800 rounded-md aspect-video overflow-hidden">
                    <Webcam ref={webcamRef} audio={false} mirrored={true} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gray-800 rounded-lg p-4 flex-grow overflow-y-auto">
                    <h3 className="font-bold text-sm mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {exam.questions.map((_, index) => {
                            const status = questionStatuses[index] || 'notVisited';
                            const statusInfo = getStatusInfo(status);
                            return (<button key={index} onClick={() => navigateQuestion(index)} className={`w-10 h-10 flex items-center justify-center rounded text-white ${statusInfo.color} ${currentQuestionIndex === index ? 'ring-2 ring-white' : ''}`}>{index + 1}</button>);
                        })}
                    </div>
                    <div className="mt-6 space-y-2 text-xs text-gray-400">
                         {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status} className="flex items-center"><span className={`w-4 h-4 rounded-full ${getStatusInfo(status).color} mr-2`}></span>{count} {getStatusInfo(status).text}</div>
                        ))}
                    </div>
                    <div className="mt-4 border-t border-gray-700 pt-2">
                        <h4 className="font-semibold text-xs mb-2">Proctoring Flags:</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {proctoringFlags.map((flag, i) => <ProctoringFlag key={i} text={flag} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamEnvironment;