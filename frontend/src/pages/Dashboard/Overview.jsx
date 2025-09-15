import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from '../../utils/UserContext';
import { BarChart3, Award, Clock, TrendingUp, Users, Code, FileText } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ label, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-900/20',
    green: 'text-green-400 bg-green-900/20',
    yellow: 'text-yellow-400 bg-yellow-900/20',
    purple: 'text-purple-400 bg-purple-900/20'
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

const Overview = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tests_taken: 0,
    exams_completed: 0,
    interviews_completed: 0,
    avg_score: 0,
    xp: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [testsRes, examsRes, interviewsRes] = await Promise.all([
          api.get('/tests/user/attempts'),
          api.get('/user/results'),
          api.get('/interview/user/results')
        ]);

        const testsTaken = testsRes.data.length;
        const examsCompleted = examsRes.data.length;
        const interviewsCompleted = interviewsRes.data.length;
        
        const totalScore = [
          ...testsRes.data.map(t => t.score),
          ...examsRes.data.map(e => e.score),
          ...interviewsRes.data.map(i => i.final_score * 20) // Convert 5-point scale to percentage
        ].reduce((sum, score) => sum + score, 0);
        
        const totalItems = testsTaken + examsCompleted + interviewsCompleted;
        const avgScore = totalItems > 0 ? (totalScore / totalItems).toFixed(1) : 0;

        setStats({
          tests_taken: testsTaken,
          exams_completed: examsCompleted,
          interviews_completed: interviewsCompleted,
          avg_score: avgScore,
          xp: (testsTaken * 10) + (examsCompleted * 20) + (interviewsCompleted * 15)
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
      <p className="text-gray-400 mb-8">Here's a snapshot of your journey on Evalytics-AI.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Experience Points" 
          value={stats.xp} 
          icon={<TrendingUp size={24} />} 
          color="yellow" 
        />
        <StatCard 
          label="Tests Taken" 
          value={stats.tests_taken} 
          icon={<Code size={24} />} 
          color="green" 
        />
        <StatCard 
          label="Exams Completed" 
          value={stats.exams_completed} 
          icon={<FileText size={24} />} 
          color="blue" 
        />
        <StatCard 
          label="Interviews Completed" 
          value={stats.interviews_completed} 
          icon={<Users size={24} />} 
          color="purple" 
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Overall Performance</h2>
          <span className="text-2xl font-bold text-blue-400">{stats.avg_score}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${stats.avg_score}%` }}
          ></div>
        </div>
        <p className="text-gray-400 mt-2 text-sm">Average score across all assessments</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate("/dashboard/practice")} 
            className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-5 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Code className="mr-2" size={20} />
            Start Practice
          </button>

          <button 
            onClick={() => navigate("/dashboard/tests")} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-5 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <FileText className="mr-2" size={20} />
            Take a Test
          </button>

          <button 
            onClick={() => navigate("/dashboard/exams")} 
            className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-5 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Code className="mr-2" size={20} />
            Take Exam
          </button>

          <button 
            onClick={() => navigate("/dashboard/interview")} 
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-5 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Users className="mr-2" size={20} />
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;