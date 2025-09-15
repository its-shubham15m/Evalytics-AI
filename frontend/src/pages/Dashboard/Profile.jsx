import { useState, useEffect } from 'react';
import { useUser } from '../../utils/UserContext';
import { UserCircle, Mail, Phone, BarChart3, Clock, Award, Code, FileText, Users } from 'lucide-react';
import api from '../../utils/api';

const InfoCard = ({ icon, label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400'
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
      <div className={`p-2 bg-gray-700 rounded-full mr-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md font-semibold text-white">{value || 'N/A'}</p>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState({
    tests_taken: 0,
    exams_completed: 0,
    interviews_completed: 0,
    avg_score: 0,
    certifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [testsRes, examsRes, interviewsRes, certsRes] = await Promise.all([
          api.get('/tests/user/attempts'),
          api.get('/user/results'),
          api.get('/interview/user/results'),
          api.get('/tests/user/certifications')
        ]);

        const testsTaken = testsRes.data.length;
        const examsCompleted = examsRes.data.length;
        const interviewsCompleted = interviewsRes.data.length;
        const certifications = certsRes.data.length;
        
        const totalScore = [
          ...testsRes.data.map(t => t.score),
          ...examsRes.data.map(e => e.score),
          ...interviewsRes.data.map(i => i.final_score * 20)
        ].reduce((sum, score) => sum + score, 0);
        
        const totalItems = testsTaken + examsCompleted + interviewsCompleted;
        const avgScore = totalItems > 0 ? (totalScore / totalItems).toFixed(1) : 0;

        setStats({
          tests_taken: testsTaken,
          exams_completed: examsCompleted,
          interviews_completed: interviewsCompleted,
          avg_score: avgScore,
          certifications: certifications
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading Profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-red-400">Could not load user profile.</div>;
  }

  return (
    <div className="text-white">
      <div className="flex items-center mb-8">
        <UserCircle size={64} className="text-blue-400 mr-4" />
        <div>
          <h1 className="text-4xl font-bold text-white">{user.firstName} {user.lastName}</h1>
          <p className="text-lg text-gray-400">@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard 
          icon={<Mail size={20} />} 
          label="Email" 
          value={user.email} 
          color="blue" 
        />
        <InfoCard 
          icon={<Phone size={20} />} 
          label="Phone Number" 
          value={user.phoneNumber} 
          color="green" 
        />
        <InfoCard 
          icon={<Clock size={20} />} 
          label="Member Since" 
          value={new Date(user.createdAt).toLocaleDateString()} 
          color="yellow" 
        />
        
        <InfoCard 
          icon={<Code size={20} />} 
          label="Tests Taken" 
          value={stats.tests_taken} 
          color="purple" 
        />
        <InfoCard 
          icon={<FileText size={20} />} 
          label="Exams Completed" 
          value={stats.exams_completed} 
          color="blue" 
        />
        <InfoCard 
          icon={<Users size={20} />} 
          label="Interviews Completed" 
          value={stats.interviews_completed} 
          color="green" 
        />
        
        <InfoCard 
          icon={<BarChart3 size={20} />} 
          label="Average Score" 
          value={`${stats.avg_score}%`} 
          color="yellow" 
        />
        <InfoCard 
          icon={<Award size={20} />} 
          label="Certifications" 
          value={stats.certifications} 
          color="purple" 
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.tests_taken}</div>
            <p className="text-gray-400">Coding Tests</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.exams_completed}</div>
            <p className="text-gray-400">Proctored Exams</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.interviews_completed}</div>
            <p className="text-gray-400">AI Interviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;