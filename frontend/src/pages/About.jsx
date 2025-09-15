const About = () => {
  return (
    <div className="font-['Inter'] flex justify-center items-center min-h-screen bg-[#162447] p-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col border border-gray-200">
        <div 
          className="bg-gradient-to-r from-[#2998e2] via-[#0f3460] to-[#1a1a2e] text-white p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, #2998e2, #0f3460, #1a1a2e)'
          }}
        >
          <h1 className="m-0 text-4xl font-bold tracking-tight">Evalytics-AI</h1>
          <p className="text-lg opacity-90 mt-2">The Future of Intelligent Assessment</p>
        </div>
        
        <div className="p-10 leading-relaxed text-slate-700">
          <div className="mb-8 last:mb-0">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-gray-200">
              About Me
            </h2>
            <p className="m-0 text-base">
              Hello! This is Avijit & Shubham. We are passionate and creative web developers dedicated to building elegant and efficient solutions for the modern web. With a strong foundation in front-end and back-end technologies, we specialize in crafting seamless user experiences and robust, scalable applications. This platform is a testament to our dedication to pushing the boundaries of what's possible with code.
            </p>
          </div>

          <div className="mb-8 last:mb-0">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-gray-200">
              About the Platform
            </h2>
            <p className="m-0 text-base">
              <strong>Evalytics-AI</strong> is an advanced, AI-powered exam platform designed to redefine the landscape of online assessments. Our mission is to provide an intuitive, fair, and insightful evaluation experience for both educators and students. From automated proctoring to in-depth performance analytics, we are building a comprehensive tool for the future of education.
            </p>
          </div>
        </div>

        <div className="text-center p-6 bg-gray-50 text-slate-600 font-medium border-t border-gray-200">
          <p>This project is currently in the development phase. <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Launching Soon!</span></p>
        </div>
      </div>
    </div>
  );
};

export default About;