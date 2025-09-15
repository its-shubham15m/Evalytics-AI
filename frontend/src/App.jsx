import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CodeIDE from './pages/CodeIDE';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/SignUp';
import Dashboard from './pages/Account/Dashboard';
import ExamEnvironment from './pages/Account/ExamEnvironment';
import TestEnvironment from './pages/Account/TestEnvironment';
import InterviewEnvironment from './pages/Account/InterviewEnvironment';

// Dashboard Subpages
import Overview from './pages/Dashboard/Overview';
import Profile from './pages/Dashboard/Profile';
import Practice from './pages/Dashboard/Practice';
import Tests from './pages/Dashboard/Tests';
import Exams from './pages/Dashboard/Exams';
import Interview from './pages/Dashboard/Interview';
import Results from './pages/Dashboard/Results';
import Certificates from './pages/Dashboard/Certificates';
import Settings from './pages/Dashboard/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ide" element={<CodeIDE />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/exam/:examId" element={<ExamEnvironment />} />
      <Route path="/test/:testId" element={<TestEnvironment />} />
      <Route path="/interview/:interviewId" element={<InterviewEnvironment />} />

      {/* Dashboard with nested routing */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="practice" element={<Practice />} />
        <Route path="tests" element={<Tests />} />
        <Route path="exams" element={<Exams />} />
        <Route path="interview" element={<Interview />} />
        <Route path="results" element={<Results />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
