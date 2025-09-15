import { useState } from 'react';
import './Exams.css';

// --- INLINE ICON ---
const FiLogIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;


const Exams = () => {

  return (
    <div className="exam-page-container">

      <div className="exam-page-header">
        <h1>Our Exam Environment</h1>
        <p>Take a look at the modern and focused interface you'll use during exams.</p>
      </div>

      {/* This is the placeholder for your animation */}
      <div className="animation-placeholder">
        {/* You can replace the content below with your animation component */}
        <div>
            <p className="placeholder-text">Exam Dashboard Sample</p>
        </div>
      </div>
      
      <div className="login-prompt-exam">
        <h2>Ready for the Real Challenge?</h2>
        <p>Log in to access official exams, track your progress, and earn certifications.</p>
        <a href="/login" className="login-btn-exam">
          Login to Start
        </a>
      </div>
    </div>
  )
}

export default Exams