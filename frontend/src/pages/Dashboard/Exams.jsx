import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FileText, Clock, AlertTriangle, Award, TrendingUp, Star } from 'lucide-react';

const ExamCard = ({ exam, status, score, onClick, isCompleted }) => {
  // Add safety checks for undefined properties
  const difficulty = exam.difficulty || 'Medium';
  const tags = exam.tags || [];
  const duration = exam.duration_minutes || 0;
  const description = exam.description || 'No description available';

  const difficultyColor = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400'
  }[difficulty];

  const statusColor = {
    Available: 'text-blue-400',
    Completed: score >= 80 ? 'text-green-400' : 'text-yellow-400'
  }[status];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <FileText className="text-blue-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">{exam.title}</h3>
        </div>
        {isCompleted && <Award className="text-yellow-400" size={20} />}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm">
          <span className={`font-semibold ${difficultyColor}`}>{difficulty}</span>
          <span className="mx-2 text-gray-600">•</span>
          <Clock size={14} className="text-gray-400 mr-1" />
          <span className="text-gray-400">{duration} mins</span>
        </div>
        
        <span className={`text-sm font-semibold ${statusColor}`}>
          {status === 'Completed' ? `${score}%` : status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Exams = () => {
  const [availableExams, setAvailableExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          api.get('/exams'),
          api.get('/user/results')
        ]);

        // Ensure we have arrays
        const examsData = examsRes.data || [];
        const resultsData = resultsRes.data || [];

        // Create a map to track unique exams by ID to avoid duplicates
        const uniqueExamsMap = new Map();
        examsData.forEach(exam => {
          if (exam._id && !uniqueExamsMap.has(exam._id)) {
            uniqueExamsMap.set(exam._id, exam);
          }
        });
        
        const uniqueExams = Array.from(uniqueExamsMap.values());
        const completedExamIds = new Set(resultsData.map(r => r.exam_id));
        
        const available = uniqueExams.filter(e => !completedExamIds.has(e._id));
        
        const completed = resultsData.map(result => {
          const exam = uniqueExams.find(e => e._id === result.exam_id);
          return exam ? { ...exam, score: result.score } : null;
        }).filter(Boolean);

        setAvailableExams(available);
        setCompletedExams(completed);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setError("Could not load exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading Exams...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <AlertTriangle className="mx-auto mb-4" size={48} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Proctored Exams</h1>
          <p className="text-gray-400 mt-2">Official exams with AI proctoring and certification</p>
        </div>
        {completedExams.length > 0 && (
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-blue-400 mr-2" size={20} />
              <span className="font-semibold">{completedExams.length} Exam(s) Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Exams Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-blue-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Available Exams</h2>
        </div>
        
        {availableExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.map(exam => (
              <ExamCard
                key={`available-${exam._id}`}
                exam={exam}
                status="Available"
                onClick={() => handleStartExam(exam._id)}
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Star className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Exams Available</h3>
            <p className="text-gray-400">
              You've completed all available exams! Check back later for new challenges.
            </p>
          </div>
        )}
      </section>

      {/* Completed Exams Section */}
      <section>
        <div className="flex items-center mb-6">
          <Award className="text-green-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Completed Exams</h2>
        </div>
        
        {completedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedExams.map(exam => (
              <ExamCard
                key={`completed-${exam._id}`}
                exam={exam}
                status="Completed"
                score={exam.score}
                onClick={() => handleStartExam(exam._id)}
                isCompleted={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <FileText className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Exams Completed</h3>
            <p className="text-gray-400">
              Start your first proctored exam to earn certifications!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Exams;