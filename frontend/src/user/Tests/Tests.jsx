import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import './Tests.css';
import { FaJava, FaRobot, FaProjectDiagram } from 'react-icons/fa'; // Example icons

const Tests = () => {
  return (
    <div className='tests-container'>
      <div className='tests-header'>
        <h1 className='tests-title'>Available Tests</h1>
        <p className='tests-subtitle'>
          Choose a test to challenge your skills and earn recognition.
        </p>
      </div>
      <div className='tests-cards-container'>
        <div className='test-card'>
          <div className='test-card-icon'>
            <FaJava />
          </div>
          <h2 className='test-card-title'>Java</h2>
          <p className='test-card-description'>
            Assess your proficiency in core Java concepts, data structures, and
            algorithms with our comprehensive Java test.
          </p>
          <button className='test-card-button'>View Details</button>
        </div>
        <div className='test-card'>
          <div className='test-card-icon'>
            <FaRobot />
          </div>
          <h2 className='test-card-title'>AI / ML</h2>
          <p className='test-card-description'>
            Dive into the world of Artificial Intelligence and Machine Learning.
            Test your knowledge of fundamental concepts and models.
          </p>
          <button className='test-card-button'>View Details</button>
        </div>
        <div className='test-card'>
          <div className='test-card-icon'>
            <FaProjectDiagram />
          </div>
          <h2 className='test-card-title'>System Design</h2>
          <p className='test-card-description'>
            Showcase your ability to design scalable and efficient systems. This
            test covers architectural patterns and best practices.
          </p>
          <button className='test-card-button'>View Details</button>
        </div>
      </div>
      <div className='login-prompt'>
        <h3 className='login-prompt-title'>Ready to prove your skills?</h3>
        <p className='login-prompt-text'>
          <Link to='/login' className='login-link'>
            Login
          </Link>{' '}
          to take tests, earn badges, and boost your profile!
        </p>
      </div>
    </div>
  );
};

export default Tests;