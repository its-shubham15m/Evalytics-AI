import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import Contact_Animation from '../assets/Contact_Animation.json';

const Contact = () => {
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );

  const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  );

  return (
    <div className="relative w-full font-['Poppins']">
      <div className="absolute top-5 left-8 z-[100]">
        <Link to="/">
          <img src="/eai.png" alt="Logo" className="w-24 h-auto" />
        </Link>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-[#d6e8f6] p-8 pt-20">
        <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex-col md:flex-row">
          <div className="flex-1 p-12 bg-gray-50">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">Contact us</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative mb-7">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon />
                </span>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl text-slate-700 bg-white focus:border-sky-400 focus:ring-3 focus:ring-sky-200 focus:outline-none transition-all" 
                  placeholder="Name" 
                />
              </div>
              <div className="relative mb-7">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <EmailIcon />
                </span>
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl text-slate-700 bg-white focus:border-sky-400 focus:ring-3 focus:ring-sky-200 focus:outline-none transition-all" 
                  placeholder="Email" 
                />
              </div>
              <div className="relative mb-7">
                <textarea 
                  className="w-full px-4 py-4 border border-slate-300 rounded-xl text-slate-700 bg-white focus:border-sky-400 focus:ring-3 focus:ring-sky-200 focus:outline-none transition-all h-32 resize-none" 
                  placeholder="Message"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-sky-500 text-white text-lg font-semibold rounded-xl hover:bg-sky-600 active:translate-y-0 hover:-translate-y-0.5 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="flex-1 flex justify-center items-center p-12 bg-gray-50">
            <Lottie animationData={Contact_Animation} loop={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;