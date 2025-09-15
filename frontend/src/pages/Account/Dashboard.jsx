import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';
import { useEffect } from 'react';
import api from '../../utils/api';

// Import icons from lucide-react
import { 
  LayoutDashboard, 
  UserCircle, 
  Code, 
  ClipboardCheck, 
  FileText,
  Mic, 
  BarChart3, 
  Award, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[2] || 'overview';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading Dashboard...</div>;
  }

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <UserCircle size={20} /> },
    { name: 'Practice', path: '/dashboard/practice', icon: <Code size={20} /> },
    { name: 'Tests', path: '/dashboard/tests', icon: <ClipboardCheck size={20} /> },
    { name: 'Exams', path: '/dashboard/exams', icon: <FileText size={20} /> },
    { name: 'Interview', path: '/dashboard/interview', icon: <Mic size={20} /> },
    { name: 'Results', path: '/dashboard/results', icon: <BarChart3 size={20} /> },
    { name: 'Certificates', path: '/dashboard/certificates', icon: <Award size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold text-white">Evalytics-AI</h1>
          <p className="text-xs text-blue-300">AI-Powered Coding Hub</p>
        </div>
        <nav className="flex-grow">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.name.toLowerCase() || (item.name === 'Overview' && activeTab === 'overview')
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div>
          <Link to="/dashboard/settings" className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
            <Settings size={20} />
            <span className="ml-3">Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center p-3 rounded-lg w-full text-red-400 hover:bg-red-900/50 transition-colors">
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
