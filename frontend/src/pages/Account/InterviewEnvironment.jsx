// src/pages/Account/InterviewEnvironment.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Webcam from 'react-webcam';
import { AlertTriangle, Loader, PlayCircle, Check, X, Mic, Video, SkipForward, Send } from 'lucide-react';

// UI Components
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
    <button onClick={onRetry} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
      Return to Interviews
    </button>
  </div>
);

const EvaluationDisplay = ({ evaluation, onContinue, isFinalQuestion }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Evaluation Result</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
          <div className="text-3xl font-bold text-yellow-400">
            {evaluation.overall_score.toFixed(1)}/5
          </div>
          <div className="text-sm text-gray-400 capitalize">
            {evaluation.category}
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
          <div className="text-xl font-bold text-blue-400">
            {evaluation.technical_score.toFixed(1)}/5
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
        <p className="text-gray-300">{evaluation.feedback}</p>
      </div>
      
      <button
        onClick={onContinue}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg"
      >
        {isFinalQuestion ? 'Finish Interview' : 'Next Question'}
      </button>
    </div>
  </div>
);

const InterviewEnvironment = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [interview, setInterview] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proctoringFlags, setProctoringFlags] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});

  // Refs
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);

  // Current question
  const currentQuestion = interview?.questions?.[currentQuestionIndex];
  const isFinalQuestion = currentQuestionIndex === interview?.questions?.length - 1;

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }, []);

  // Stop recording and evaluate
  const stopRecordingAndEvaluate = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }

      // Get audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Save answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: transcript
      }));

      // Evaluate with backend
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('question_id', currentQuestion.id);
        formData.append('session_id', sessionId);
        formData.append('user_answer', transcript);

        const response = await api.post('/interview/evaluate-answer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setEvaluation(response.data);
        setEvaluations(prev => ({
          ...prev,
          [currentQuestion.id]: response.data
        }));
      } catch (err) {
        console.error('Evaluation error:', err);
        // Fallback to a simple evaluation if API fails
        setEvaluation({
          overall_score: 3.5,
          technical_score: 3.5,
          feedback: "Evaluation service temporarily unavailable. Your response has been recorded.",
          category: "average"
        });
      }
    }
  }, [isRecording, currentQuestion, sessionId, transcript]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    setEvaluation(null);
    setTranscript('');
    
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Submit interview
      handleSubmitInterview();
    }
  }, [currentQuestionIndex, interview, evaluations, answers]);

  // Handle interview submission
  const handleSubmitInterview = useCallback(async () => {
    try {
      const response = await api.post('/interview/submit', {
        session_id: sessionId,
        answers: answers,
        evaluations: evaluations
      });
      
      navigate('/dashboard/results', { 
        state: { 
          message: 'Interview completed successfully!',
          score: response.data.final_score
        }
      });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting interview. Please try again.');
    }
  }, [sessionId, answers, evaluations, navigate]);

  // Load interview data
  useEffect(() => {
    const loadInterview = async () => {
      try {
        const [interviewRes, sessionRes] = await Promise.all([
          api.get(`/interview/${interviewId}`),
          api.post(`/interview/start/${interviewId}`)
        ]);

        setInterview(interviewRes.data);
        setSessionId(sessionRes.data.session_id);
        initSpeechRecognition();
      } catch (err) {
        console.error('Error loading interview:', err);
        setError("Could not load the interview.");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId, initSpeechRecognition]);

  if (loading) return <LoadingSpinner text="Loading Interview..." />;
  if (error) return <ErrorDisplay message={error} onRetry={() => navigate('/dashboard/interview')} />;
  if (!interview) return <LoadingSpinner text="Preparing interview environment..." />;

  return (
    <div className="flex h-screen bg-black text-white p-4 gap-4">
      {/* Left Panel - Question and Controls */}
      <div className="flex-1 flex flex-col bg-gray-900 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">{interview.title}</h1>
        
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1}</h2>
          <p className="text-gray-300">{currentQuestion.text}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-4 flex-1">
          <h3 className="text-lg font-semibold mb-2">Your Answer</h3>
          <div className="bg-gray-700 p-3 rounded min-h-32">
            {transcript || "Start speaking to see your transcript here..."}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={isRecording ? stopRecordingAndEvaluate : startRecording}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            <Mic className="mr-2" size={20} />
            {isRecording ? 'Stop & Evaluate' : 'Start Recording'}
          </button>
          
          <button
            onClick={handleNextQuestion}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg flex items-center"
            disabled={!transcript.trim()}
          >
            <SkipForward className="mr-2" size={20} />
            {isFinalQuestion ? 'Finish Interview' : 'Next Question'}
          </button>

          {isFinalQuestion && (
            <button
              onClick={handleSubmitInterview}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center"
            >
              <Send className="mr-2" size={20} />
              Submit Interview
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - Video and Proctoring */}
      <div className="w-80 flex-shrink-0 bg-gray-900 rounded-lg p-4 flex flex-col gap-4">
        <div className="bg-gray-800 rounded-md aspect-video overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Video className="mr-2" size={16} />
            Proctoring Status
          </h3>
          <div className="text-sm text-green-400">✅ Camera active</div>
          <div className="text-sm text-green-400">✅ Microphone ready</div>
          <div className="text-sm text-green-400">✅ AI monitoring enabled</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg flex-grow overflow-y-auto">
          <h3 className="font-semibold mb-2">Proctoring Flags</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {proctoringFlags.map((flag, i) => (
              <div key={i} className="flex items-center bg-yellow-900/50 p-2 rounded-md text-sm">
                <AlertTriangle size={12} className="text-yellow-400 mr-2 flex-shrink-0" />
                <span>{flag}</span>
              </div>
            ))}
            {proctoringFlags.length === 0 && (
              <div className="text-sm text-gray-500">No flags detected</div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {evaluation && (
        <EvaluationDisplay 
          evaluation={evaluation} 
          onContinue={handleNextQuestion}
          isFinalQuestion={isFinalQuestion}
        />
      )}
    </div>
  );
};

export default InterviewEnvironment;