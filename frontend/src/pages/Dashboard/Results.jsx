// src/pages/Dashboard/Results.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BarChart3, Award, Clock, Check, X, BookOpen, FileText, Users, Mic } from 'lucide-react';

const ResultCard = ({ result, type }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'exam': return <FileText className="text-blue-400" size={20} />;
      case 'test': return <BookOpen className="text-green-400" size={20} />;
      case 'interview': return <Users className="text-purple-400" size={20} />;
      default: return <BookOpen className="text-gray-400" size={20} />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'exam': return 'text-blue-400';
      case 'test': return 'text-green-400';
      case 'interview': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // For interviews, we have a score out of 5, for others it's percentage
  const isInterview = type === 'interview';
  const score = isInterview ? result.final_score : result.score;
  const scoreDisplay = isInterview ? `${score.toFixed(1)}/5` : `${score}%`;
  const passed = isInterview ? score >= 3.5 : score >= (result.pass_criteria || 80);
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getTypeIcon()}
          <h3 className="text-xl font-bold text-white ml-3">{result.interview_title || result.test_name || result.exam_title}</h3>
        </div>
        {passed && <Award className="text-yellow-400" size={20} />}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className={`text-sm font-semibold ${getTypeColor()}`}>
            {type?.charAt(0).toUpperCase() + type?.slice(1)}
          </span>
          {result.difficulty && (
            <>
              <span className="mx-2 text-gray-600">•</span>
              <span className={`text-sm ${
                result.difficulty === 'Easy' || result.difficulty === 'Beginner' ? 'text-green-400' :
                result.difficulty === 'Medium' || result.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {result.difficulty}
              </span>
            </>
          )}
        </div>

        <div className={`flex items-center text-lg font-bold ${
          passed ? 'text-green-400' : 'text-red-400'
        }`}>
          {passed ? <Check size={20} className="mr-1" /> : <X size={20} className="mr-1" />}
          {scoreDisplay}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
        {result.submitted_at && (
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            {new Date(result.submitted_at).toLocaleDateString()}
          </div>
        )}
        {result.duration_minutes && (
          <div>{result.duration_minutes} minutes</div>
        )}
        {result.questions && (
          <div>{result.questions.length} questions</div>
        )}
        {isInterview && (
          <div className="flex items-center">
            <Mic size={14} className="mr-2" />
            AI Interview
          </div>
        )}
      </div>

      {result.details && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2">Detailed Results:</h4>
          <div className="space-y-2 text-sm">
            {Object.entries(result.details).map(([questionId, detail]) => (
              <div key={questionId} className="flex justify-between items-center">
                <span>Question {questionId}:</span>
                <span className={detail.is_correct ? 'text-green-400' : 'text-red-400'}>
                  {detail.is_correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span>Passing Criteria: {isInterview ? '3.5/5' : (result.pass_criteria || 80) + '%'}</span>
          <span className={passed ? 'text-green-400' : 'text-red-400'}>
            {passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>
      </div>
    </div>
  );
};

const Results = () => {
  const [examResults, setExamResults] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [interviewResults, setInterviewResults] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [examResultsRes, testAttemptsRes, interviewResultsRes, certsRes] = await Promise.all([
          api.get('/user/results'), // Exam results
          api.get('/tests/user/attempts'), // Test attempts
          api.get('/interview/user/results'), // Interview results
          api.get('/tests/user/certifications') // Certifications
        ]);

        setExamResults(examResultsRes.data || []);
        setTestResults(testAttemptsRes.data || []);
        setInterviewResults(interviewResultsRes.data || []);
        setCertifications(certsRes.data || []);

      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = () => {
    const allResults = [
      ...examResults.map(r => ({ ...r, type: 'exam' })),
      ...testResults.map(r => ({ ...r, type: 'test' })),
      ...interviewResults.map(r => ({ ...r, type: 'interview' }))
    ];

    switch (activeTab) {
      case 'exams': return allResults.filter(r => r.type === 'exam');
      case 'tests': return allResults.filter(r => r.type === 'test');
      case 'interviews': return allResults.filter(r => r.type === 'interview');
      case 'certified': return allResults.filter(r => 
        (r.type === 'interview' ? r.final_score >= 3.5 : r.score >= (r.pass_criteria || 80))
      );
      default: return allResults;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading Results...
        </div>
      </div>
    );
  }

  const totalResults = filteredResults().length;
  const passedResults = filteredResults().filter(r => 
    (r.type === 'interview' ? r.final_score >= 3.5 : r.score >= (r.pass_criteria || 80))
  ).length;
  
  const averageScore = totalResults > 0 
    ? (filteredResults().reduce((sum, r) => {
        const score = r.type === 'interview' ? r.final_score * 20 : r.score;
        return sum + score;
      }, 0) / totalResults).toFixed(1)
    : 0;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Results</h1>
          <p className="text-gray-400 mt-2">Track your performance across all assessments</p>
        </div>
        
        {certifications.length > 0 && (
          <div className="bg-yellow-900/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-yellow-400 mr-2" size={20} />
              <span className="font-semibold">{certifications.length} Certification(s)</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <BarChart3 className="text-blue-400 mr-3" size={24} />
            <h3 className="text-lg font-semibold">Total Attempts</h3>
          </div>
          <p className="text-3xl font-bold">{totalResults}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <Check className="text-green-400 mr-3" size={24} />
            <h3 className="text-lg font-semibold">Pass Rate</h3>
          </div>
          <p className="text-3xl font-bold">
            {totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0}%
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <Award className="text-yellow-400 mr-3" size={24} />
            <h3 className="text-lg font-semibold">Avg. Score</h3>
          </div>
          <p className="text-3xl font-bold">{averageScore}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'exams', label: 'Exams' },
          { id: 'tests', label: 'Tests' },
          { id: 'interviews', label: 'Interviews' },
          { id: 'certified', label: 'Certified' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-semibold ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      {filteredResults().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults()
            .sort((a, b) => new Date(b.submitted_at || b.awarded_at) - new Date(a.submitted_at || a.awarded_at))
            .map((result, index) => (
              <ResultCard key={index} result={result} type={result.type} />
            ))
          }
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl text-center">
          <BarChart3 className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="text-xl font-bold mb-2">No Results Yet</h3>
          <p className="text-gray-400">
            {activeTab === 'all' 
              ? "Complete your first assessment to see results here." 
              : `No ${activeTab} results found.`}
          </p>
        </div>
      )}

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

export default Results;