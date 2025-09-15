// src/pages/Dashboard/Tests.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Code, Award, Clock, Star, TrendingUp } from 'lucide-react';

// Update the TestCard component to show better information
const TestCard = ({ test, status, score, onClick, isCertified }) => {
    const difficultyColor = {
        'Beginner': 'text-green-400',
        'Easy': 'text-green-400',
        'Intermediate': 'text-yellow-400',
        'Medium': 'text-yellow-400',
        'Advanced': 'text-red-400',
        'Hard': 'text-red-400'
    }[test.difficulty];

    const statusColor = {
        'Available': 'text-blue-400',
        'Completed': score >= (test.pass_criteria || 80) ? 'text-green-400' : 'text-yellow-400'
    }[status];

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer" onClick={onClick}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <Code className="text-blue-400 mr-3" size={24} />
                    <h3 className="text-xl font-bold text-white">{test.title}</h3>
                </div>
                {isCertified && <Award className="text-yellow-400" size={20} />}
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{test.description}</p>
            
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm">
                    <span className={`font-semibold ${difficultyColor}`}>{test.difficulty}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-400">{test.duration_minutes} mins</span>
                </div>
                
                <span className={`text-sm font-semibold ${statusColor}`}>
                    {status === 'Completed' ? `${score}%` : status}
                </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {test.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {test.questions.length} questions
                    {test.questions.filter(q => q.question_type === 'coding').length > 0 && 
                        ` (${test.questions.filter(q => q.question_type === 'coding').length} coding)`
                    }
                </span>
                <span className="text-xs text-gray-500">{test.language}</span>
            </div>
            
            {status === 'Completed' && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Pass Criteria: {test.pass_criteria || 80}%</span>
                        {score >= (test.pass_criteria || 80) ? (
                            <span className="text-green-400 font-semibold">✓ Certified</span>
                        ) : (
                            <span className="text-yellow-400">Try Again</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const Tests = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, attemptsRes, certsRes] = await Promise.all([
          api.get('/tests'),
          api.get('/tests/user/attempts'),
          api.get('/tests/user/certifications')
        ]);

        const completedTestIds = new Set(attemptsRes.data.map(a => a.test_id));
        const available = testsRes.data.filter(t => !completedTestIds.has(t._id));
        
        const completed = attemptsRes.data.map(attempt => {
          const test = testsRes.data.find(t => t._id === attempt.test_id);
          return test ? { ...test, score: attempt.score } : null;
        }).filter(Boolean);

        setAvailableTests(available);
        setCompletedTests(completed);
        setCertifications(certsRes.data);
      } catch (error) {
        console.error("Failed to fetch test data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const isCertified = (testId) => {
    return certifications.some(cert => cert.test_id === testId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading Tests...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Coding Tests</h1>
          <p className="text-gray-400 mt-2">Test your programming skills and earn certifications</p>
        </div>
        {certifications.length > 0 && (
          <div className="bg-yellow-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-yellow-400 mr-2" size={20} />
              <span className="font-semibold">{certifications.length} Certification(s) Earned</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Tests Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-blue-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Available Tests</h2>
        </div>
        
        {availableTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map(test => (
              <TestCard
                key={test._id}
                test={test}
                status="Available"
                onClick={() => handleStartTest(test._id)}
                isCertified={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Star className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Tests Available</h3>
            <p className="text-gray-400">You've completed all available tests! Check back later for new challenges.</p>
          </div>
        )}
      </section>

      {/* Completed Tests Section */}
      <section>
        <div className="flex items-center mb-6">
          <Award className="text-green-400 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Completed Tests</h2>
        </div>
        
        {completedTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTests.map(test => (
              <TestCard
                key={test._id}
                test={test}
                status="Completed"
                score={test.score}
                onClick={() => handleStartTest(test._id)}
                isCertified={isCertified(test._id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center">
            <Code className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Tests Completed</h3>
            <p className="text-gray-400">Start your first test to showcase your programming skills!</p>
          </div>
        )}
      </section>

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map(cert => (
              <div key={cert._id} className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-700">
                <div className="flex items-center mb-4">
                  <Award className="text-yellow-400 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-yellow-300">{cert.test_name}</h3>
                </div>
                <p className="text-yellow-200 mb-2">Score: {cert.score}%</p>
                <p className="text-yellow-400 text-sm">
                  Awarded on: {new Date(cert.awarded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Tests;