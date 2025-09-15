import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { BookOpen, Award, Clock, Star, TrendingUp, Code } from 'lucide-react';

const PracticeCard = ({ practice, status, score, onClick, isCompleted }) => {
  const difficultyColor = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400'
  }[practice.difficulty];

  const statusColor = {
    Available: 'text-blue-400',
    Completed: score >= 80 ? 'text-green-400' : 'text-yellow-400'
  }[status];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-500 transition-all cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <BookOpen className="text-green-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">{practice.title}</h3>
        </div>
        {isCompleted && <Award className="text-yellow-400" size={20} />}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{practice.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm">
          <span className={`font-semibold ${difficultyColor}`}>{practice.difficulty}</span>
          <span className="mx-2 text-gray-600">•</span>
          <Clock size={14} className="text-gray-400 mr-1" />
          <span className="text-gray-400">{practice.duration_minutes} mins</span>
        </div>
        
        <span className={`text-sm font-semibold ${statusColor}`}>
          {status === 'Completed' ? `${score}%` : status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {practice.tags.map(tag => (
          <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Practice = () => {
  const [availablePractice, setAvailablePractice] = useState([]);
  const [completedPractice, setCompletedPractice] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [practiceRes, attemptsRes] = await Promise.all([
          api.get('/practice'),
          api.get('/user/attempts?type=practice')
        ]);

        const completedIds = new Set(attemptsRes.data.map(a => a.practice_id));
        const available = practiceRes.data.filter(p => !completedIds.has(p._id));
        
        const completed = attemptsRes.data.map(attempt => {
          const practice = practiceRes.data.find(p => p._id === attempt.practice_id);
          return practice ? { ...practice, score: attempt.score } : null;
        }).filter(Boolean);

        setAvailablePractice(available);
        setCompletedPractice(completed);
      } catch (error) {
        console.error("Failed to fetch practice data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartPractice = (practiceId) => {
    navigate(`/practice/${practiceId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          Loading Practice Arena...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Practice Arena</h1>
          <p className="text-gray-400 mt-2">Sharpen your skills with practice challenges</p>
        </div>
        {completedPractice.length > 0 && (
          <div className="bg-green-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-green-400 mr-2" size={20} />
              <span className="font-semibold">{completedPractice.length} Practice(s) Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Practice Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-green-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Available Practice</h2>
        </div>
        
        {availablePractice.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePractice.map(practice => (
              <PracticeCard
                key={practice._id}
                practice={practice}
                status="Available"
                onClick={() => handleStartPractice(practice._id)}
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Star className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Practice Available</h3>
            <p className="text-gray-400">You've completed all available practice! Check back later for new challenges.</p>
          </div>
        )}
      </section>

      {/* Completed Practice Section */}
      <section>
        <div className="flex items-center mb-6">
          <Award className="text-blue-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Completed Practice</h2>
        </div>
        
        {completedPractice.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedPractice.map(practice => (
              <PracticeCard
                key={practice._id}
                practice={practice}
                status="Completed"
                score={practice.score}
                onClick={() => handleStartPractice(practice._id)}
                isCompleted={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Practice Completed</h3>
            <p className="text-gray-400">Start your first practice session to improve your skills!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Practice;