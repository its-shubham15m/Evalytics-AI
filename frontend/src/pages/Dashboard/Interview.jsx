// src/pages/Dashboard/Interview.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Users, Award, Clock, Star, TrendingUp, Mic, Video } from 'lucide-react';

const InterviewCard = ({ interview, status, score, onClick, isCompleted }) => {
  const difficultyColor = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400'
  }[interview.difficulty];

  const statusColor = {
    Available: 'text-blue-400',
    Completed: score >= 3.5 ? 'text-green-400' : 'text-yellow-400'
  }[status];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Users className="text-purple-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">{interview.title}</h3>
        </div>
        {isCompleted && <Award className="text-yellow-400" size={20} />}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{interview.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm">
          <span className={`font-semibold ${difficultyColor}`}>{interview.difficulty}</span>
          <span className="mx-2 text-gray-600">•</span>
          <Clock size={14} className="text-gray-400 mr-1" />
          <span className="text-gray-400">{interview.duration_minutes} mins</span>
        </div>
        
        <span className={`text-sm font-semibold ${statusColor}`}>
          {status === 'Completed' ? `${score}/5` : status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {interview.tags.map(tag => (
          <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Video size={12} className="mr-1" />
          <span>Video Proctored</span>
        </div>
        <div className="flex items-center">
          <Mic size={12} className="mr-1" />
          <span>Audio Analysis</span>
        </div>
      </div>
    </div>
  );
};

const Interviews = () => {
  const [availableInterviews, setAvailableInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, resultsRes] = await Promise.all([
          api.get('/interview'),
          api.get('/interview/user/results')
        ]);

        const completedInterviewIds = new Set(resultsRes.data.map(r => r.interview_id));
        const available = interviewsRes.data.filter(i => !completedInterviewIds.has(i._id));
        
        const completed = resultsRes.data.map(result => {
          const interview = interviewsRes.data.find(i => i._id === result.interview_id);
          return interview ? { ...interview, score: result.final_score } : null;
        }).filter(Boolean);

        setAvailableInterviews(available);
        setCompletedInterviews(completed);
      } catch (error) {
        console.error("Failed to fetch interview data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartInterview = (interviewId) => {
    navigate(`/interview/${interviewId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          Loading Interviews...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">AI-Powered Interviews</h1>
          <p className="text-gray-400 mt-2">Practice with AI-driven interviews featuring real-time video and audio analysis</p>
        </div>
        {completedInterviews.length > 0 && (
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-purple-400 mr-2" size={20} />
              <span className="font-semibold">{completedInterviews.length} Interview(s) Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Interviews Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-purple-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Available Interviews</h2>
        </div>
        
        {availableInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableInterviews.map(interview => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                status="Available"
                onClick={() => handleStartInterview(interview._id)}
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Star className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Interviews Available</h3>
            <p className="text-gray-400">You've completed all available interviews! Check back later for new challenges.</p>
          </div>
        )}
      </section>

      {/* Completed Interviews Section */}
      <section>
        <div className="flex items-center mb-6">
          <Award className="text-green-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Completed Interviews</h2>
        </div>
        
        {completedInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedInterviews.map(interview => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                status="Completed"
                score={interview.score}
                onClick={() => handleStartInterview(interview._id)}
                isCompleted={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Users className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Interviews Completed</h3>
            <p className="text-gray-400">Start your first AI-powered interview to practice your skills!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Interviews;