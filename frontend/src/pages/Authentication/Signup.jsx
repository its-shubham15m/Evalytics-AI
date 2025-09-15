import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import AuthForm from './AuthForm';
import animationData from '../../assets/login_signup_animation.json';

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <AuthForm type="signup" />
      </div>

      {/* Animation Section - Now visible on all screens */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-800">
        {/* Responsive Lottie Container */}
        <div className="w-full max-w-xs md:max-w-md h-48 md:h-64 lg:h-auto">
          <Lottie 
            animationData={animationData} 
            loop={true}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Login Link */}
        <p className="mt-4 md:mt-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}