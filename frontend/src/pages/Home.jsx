import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'
import Lottie from 'react-lottie';
import animationData from '../assets/animation.json';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [typedText, setTypedText] = useState('');
  const fullText = "Level Up with AI-Based Code Testing & Exams";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const [code, setCode] = useState(`def reverse_string(s):\n    return s[::-1]\n\nprint(reverse_string("hello"))`);
  const language = 71; // Python by default
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runCode = async () => {
    setIsSubmitting(true);
    setOutput('⏳ Running...');

    try {
      const { data } = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false',
        { source_code: code, language_id: language },
        {
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_JUDGE0_API_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );

      const poll = async () => {
        const res = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${data.token}?base64_encoded=false`,
          {
            headers: {
              'x-rapidapi-key': import.meta.env.VITE_JUDGE0_API_KEY,
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        if (res.data.status.id <= 2) {
          setTimeout(poll, 1000);
        } else {
          setOutput(res.data.stdout || res.data.stderr || res.data.compile_output || 'No output');
          setIsSubmitting(false);
        }
      };

      poll();
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const howItWorksSteps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create your free account in seconds"
  },
  {
    number: 2,
    title: "Select Skill Path",
    description: "Choose Test, Practice, or Exam mode"
  },
  {
    number: 3,
    title: "Solve & Submit Code",
    description: "Write code in our intelligent IDE"
  },
  {
    number: 4,
    title: "Get AI Feedback",
    description: "Receive detailed score reports"
  },
  {
    number: 5,
    title: "Track Progress",
    description: "Download certificates and improve"
  }
  ];

  const testimonials = [
    {
      text: 'Got my job after acing tests here!',
      author: 'Aayush, Software Engineer',
      photo: '../users/aayush.jpg',
    },
    {
      text: 'Practiced C++ daily with Evalytics IDE',
      author: 'Minal, CS Student',
      photo: '../users/minal.webp',
    },
    {
      text: 'The AI feedback helped me improve my Python skills dramatically',
      author: 'Raj, Data Scientist',
      photo: '../users/raj.jpg',
    },
    {
      text: 'Evalytics helped me crack my first tech interview with confidence.',
      author: 'Priya, Frontend Developer',
      photo: '../users/priya.jpeg',
    },
    {
      text: 'Mock tests here feel exactly like real interviews. Highly recommended!',
      author: 'Sahil, Backend Engineer',
      photo: '../users/sahil.jpg',
    },
    {
      text: 'This platform made DSA finally click for me. Loved the explanations!',
      author: 'Neha, Software Intern',
      photo: '../users/neha.jpg',
    },
    {
      text: 'I practiced daily with their Java compiler and saw huge improvements.',
      author: 'Ankit, Java Developer',
      photo: '../users/ankit.webp',
    },
    {
      text: 'The UI is clean, fast, and perfect for serious prep.',
      author: 'Riya, B.Tech Student',
      photo: '../users/riya.gif',
    },
    {
      text: 'Evalytics gave me the structured path I needed. No more confusion.',
      author: 'Dev, Self-Taught Programmer',
      photo: '../users/dev.jpg',
    },
    {
      text: 'Their AI explained my mistakes better than any tutor.',
      author: 'Tanvi, Full Stack Developer',
      photo: '../users/tanvi.jpg',
    },
    {
      text: 'Honestly, this app kept me consistent. And consistency got me hired.',
      author: 'Arjun, Associate Software Engineer',
      photo: '../users/arjun.jpg',
    },
    {
      text: 'I loved competing with others in real-time challenges!',
      author: 'Megha, Coding Enthusiast',
      photo: '../users/megha.jpg',
    },
    {
      text: 'I owe my internship to Evalytics. Period.',
      author: 'Kunal, Final Year Student',
      photo: '../users/kunal.jpg',
    },
  ];

  const offerings = [
    {
      icon: 'fa-solid fa-brain',
      title: 'Coding Language Tests',
      description: 'Timed tests in Python, Java, C++, etc. Auto-graded with explanations. Beginner to advanced levels.',
      link: '/tests',
      action: 'Try Now'
    },
    {
      icon: 'fa-solid fa-laptop-code',
      title: 'Practice IDE',
      description: 'Real-time online editor with hints & test cases. AI hints and code feedback. Save and track your practice history.',
      link: '/ide',
      action: 'Explore'
    },
    {
      icon: 'fa-solid fa-scroll',
      title: 'Full Exam Mode',
      description: 'Exam interface simulating real interview tests. Proctoring support & final reports. Certification on completion.',
      link: '/exams',
      action: 'Learn More'
    }
  ];

  const languages = [
    { name: 'Python', iconClass: 'bxl-python' },
    { name: 'Java', iconClass: 'bxl-java' },
    { name: 'C++', iconClass: 'bxl-c-plus-plus' }, 
    { name: 'C', iconClass: 'fa-solid fa-c' }, 
    { name: 'JavaScript', iconClass: 'bxl-javascript' },
    { name: 'SQL', iconClass: 'bxs-data' },
    { name: 'Go', iconClass: 'bxl-go-lang' },
    { name: 'TypeScript', iconClass: 'bxl-typescript' },
  ];

  const benefits = [
    {
      icon: 'fa-regular fa-circle-check',
      title: 'AI-Powered Evaluations',
      description: 'Get detailed feedback on your code quality and performance'
    },
    {
      icon: 'fa-regular fa-circle-check',
      title: 'Instant Feedback & Reports',
      description: 'Real-time results with actionable insights'
    },
    {
      icon: 'fa-regular fa-circle-check',
      title: 'Adaptive Learning',
      description: 'Questions adjust to your skill level'
    },
    {
      icon: 'fa-regular fa-circle-check',
      title: 'Track Progress',
      description: 'Visualize your improvement over time'
    },
    {
      icon: 'fa-regular fa-circle-check',
      title: 'Resume Boost',
      description: 'Earn verifiable certificates'
    },
    {
      icon: 'fa-regular fa-circle-check',
      title: 'Developer-Focused UX',
      description: 'Built by developers, for developers'
    }
  ];

  const VISIBLE_COUNT = 5;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1)); 
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleFooterLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const el = document.querySelector("#head");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="overflow-x-hidden text-text-dark" style={{fontFamily: "'Raleway', sans-serif"}}>
      {/* 1. Header / Navigation Bar */}
      <header className="sticky top-0 z-50 text-white shadow-md" style={{background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-blue) 100%)', fontWeight: 300}} id="head">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center text-2xl font-extrabold">
            <img src="/eai.png" alt="Logo" className="mr-2" width={100} />
            <span>Evalytics-AI</span>
          </div>

          <nav className="hidden md:flex gap-8">
            <Link 
              to="/" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              Home
            </Link>
            <Link 
              to="/tests" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              Tests
            </Link>
            <Link 
              to="/ide" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              IDE Practice
            </Link>
            <Link 
              to="/exams" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              Exams
            </Link>
            <Link 
              to="/about" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              About
            </Link>
            <Link 
              to="/contact" 
              className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex gap-4 items-center">
            <Link to="/login" className="px-4 py-2 font-semibold rounded border border-white hover:bg-[#0091ff] transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded text-[var(--primary-dark)] bg-white font-semibold hover:bg-[#16ddf3] transition-colors">
              Sign Up
            </Link>
          </div>

          <button 
            className="md:hidden relative w-10 h-10 focus:outline-none -mr-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            {/* Hamburger bars that maintain exact original shape */}
            <span 
              className={`absolute block w-8 h-0.5 bg-white transition-all duration-300 ease-in-out left-1 ${
                menuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-3'
              }`}
              style={{ transformOrigin: 'center' }}
            ></span>
            <span 
              className={`absolute block w-8 h-0.5 bg-white transition-all duration-300 ease-in-out left-1 ${
                menuOpen ? 'opacity-0 scale-x-0' : 'top-1/2 -translate-y-1/2'
              }`}
              style={{ transformOrigin: 'center' }}
            ></span>
            <span 
              className={`absolute block w-8 h-0.5 bg-white transition-all duration-300 ease-in-out left-1 ${
                menuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-3'
              }`}
              style={{ transformOrigin: 'center' }}
            ></span>
          </button>
        </div>

        {menuOpen && (
          <div className="bg-primary-dark px-8 py-6 flex flex-col gap-4 animate-[fadeSlideDown_0.3s_ease-in-out] md:hidden">
            <nav className="flex flex-col gap-6">
              <Link 
                to="/" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                Home
              </Link>
              <Link 
                to="/tests" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                Tests
              </Link>
              <Link 
                to="/ide" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                IDE Practice
              </Link>
              <Link 
                to="/exams" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                Exams
              </Link>
              <Link 
                to="/about" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                onClick={toggleMenu}
                className="relative px-2 py-1 font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-1/3"
              >
                Contact
              </Link>
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              <Link 
                to="/login" 
                onClick={toggleMenu} 
                className="px-4 py-3 rounded border border-white text-primary-dark font-semibold text-center hover:bg-[#0091ff] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={toggleMenu} 
                className="px-4 py-3 rounded text-[var(--primary-dark)] bg-white text-primary-dark font-semibold text-center hover:bg-[#16ddf3] hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary-blue)] text-white px-8 py-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-center">
        <div className="max-w-[500px] z-10 md:mr-16 mb-12 md:mb-0">
          <h1 className="text-4xl font-bold md:text-5xl mb-6 leading-tight">
            <span>{typedText}</span>
            <span className="animate-[blink_1s_infinite]">|</span>
          </h1>
          <p className="text-lg md:text-xl font-extralight mb-8 text-white/90">
            Practice. Test. Certify. Master coding through structured assessments and an intelligent IDE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/login" className="inline-block px-6 py-3 rounded text-white font-semibold border border-t-white hover:bg-[var(--accent-blue)] hover:-translate-y-0.5 transition-all text-center">
              Start Coding
            </Link>
            <Link to="/tests" className="inline-block px-6 py-3 rounded bg-transparent text-[var(--accent-blue)] font-semibold border-2 border-[var(--accent-blue)] hover:bg-[var(rgba(52, 152, 219, 0.1))] hover:-translate-y-0.5 transition-all text-center">
              Take a Sample Test
            </Link>
          </div>
        </div>
        <div className="max-w-[600px] w-full">
          <Lottie options={defaultOptions} />
        </div>
      </section>

      {/* 3. Key Offerings Cards */}
      <section className="py-20 px-8 bg-[var(--primary-light)]">
        <h2 className="text-center text-3xl md:text-4xl mb-10 text-[var(--primary-dark)] font-bold">Master Coding with Our AI Platform</h2>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="text-4xl mb-6"><i className={offering.icon}></i></div>
              <h3 className="text-2xl mb-4 font-semibold">{offering.title}</h3>
              <p className="text-black mb-6 font-medium">{offering.description}</p>
              <Link to={offering.link} className="inline-block px-4 py-2 rounded bg-[var(--accent-blue)] text-white text-sm hover:bg-[var(--primary-blue)] transition-colors">
                {offering.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
            How Evalytics-AI Works
          </h2>
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {howItWorksSteps.map((step) => (
              <div 
                key={step.number} 
                className="bg-cyan-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{fontFamily: 'Times New Roman'}}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-800">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Languages Section */}
      <section className="py-20 px-8 bg-[var(--primary-light)]">
        <h2 className="text-center text-3xl md:text-4xl mb-10 font-bold">Practice & Test in Your Favorite Language</h2>
        <div className="max-w-[800px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {languages.map((lang) => (
            <div key={lang.name} className="bg-white rounded-lg p-6 text-center shadow-sm hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">
                {lang.name === 'C' ? (
                  <i className={lang.iconClass}></i>
                ) : (
                  <i className={`bx ${lang.iconClass}`}></i>
                )}
              </div>
              <h3 className="text-lg mb-4 font-semibold">{lang.name}</h3>
              <div className="flex flex-col gap-2 mt-4">
                <Link to={`/practice/${lang.name.toLowerCase()}`} className="text-[var(--accent-blue)] font-semibold text-sm hover:underline">
                  Practice Mode
                </Link>
                <Link to={`/tests/${lang.name.toLowerCase()}`} className="text-[var(--accent-blue)] font-semibold text-sm hover:underline">
                  Test Mode
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-text-light italic">+ More languages coming soon</p>
      </section>

      {/* 6. Live Demo Section */}
      <section className="py-20 px-8 bg-[var(--primary-blue)]">
        <h2 className="text-center text-3xl md:text-4xl mb-10 text-white font-bold">Try Our Online IDE Now</h2>
        <div className="max-w-[800px] mx-auto rounded-lg overflow-hidden shadow-lg">
          <div className="bg-[var(--primary-dark)] text-white p-4">
            <h3 className="text-lg font-semibold">Problem: Reverse a string in Python</h3>
          </div>
          <textarea
            className="w-full min-h-[300px] p-4 bg-[var(--primary-light)] text-[var(--primary-dark)] font-mono text-sm resize-y outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex gap-4 p-4 bg-gray-100">
            <button 
              onClick={runCode} 
              disabled={isSubmitting}
              className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-[var(--accent-blue)]'} text-white font-medium cursor-pointer`}
            >
              {isSubmitting ? 'Running...' : 'Run Code'}
            </button>
            <button className="px-4 py-2 rounded bg-[var(--primary-dark)] text-white font-medium cursor-pointer">
              Submit
            </button>
          </div>
          <div className="p-4 bg-gray-100">
            <h4 className="text-lg mb-2 font-bold">Output</h4>
            <div className="min-h-[100px] bg-white p-3 rounded">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Evalytics-AI? Section */}
      <section className="py-20 px-8 bg-[var(--primary-light)]">
        <h2 className="text-center text-3xl md:text-4xl mb-10 text-[var(--primary-dark)] font-bold">Why Choose Evalytics-AI?</h2>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl mb-4 text-[var(--accent-blue)]"><i className={benefit.icon}></i></div>
              <h3 className="text-xl mb-2 font-bold">{benefit.title}</h3>
              <p className="text-[var(--primary-dark) text-sm font-medium">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Certifications + Exam Showcase */}
      <section className="py-20 px-8 bg-white max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl mb-6 text-primary-dark">Ace Your Exams with Confidence</h2>
          <p className="mb-6">Our proctored exam environment simulates real technical interviews with timed sections, question navigation, and comprehensive evaluation.</p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center"><span className="mr-2 text-accent-blue">✓</span> Proctored sessions (optional)</li>
            <li className="flex items-center"><span className="mr-2 text-accent-blue">✓</span> Detailed scorecard & downloadable results</li>
            <li className="flex items-center"><span className="mr-2 text-accent-blue">✓</span> Multiple re-attempt support</li>
            <li className="flex items-center"><span className="mr-2 text-accent-blue">✓</span> Industry-recognized certificates</li>
          </ul>
          <Link to="/exams" className="inline-block px-6 py-3 rounded bg-[var(--accent-blue)] text-white font-medium hover:bg-[var(--primary-blue)] hover:-translate-y-0.5 transition-all">
            Explore Full Exam Mode
          </Link>
        </div>
        <div className="flex-1 bg-gray-100 rounded-lg h-[300px] shadow-md">
          {/* Exam dashboard preview */}
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-20 px-8 bg-[var(--primary-light)] text-center overflow-hidden">
        <h2 className="text-3xl md:text-4xl mb-10 text-[var(--primary-dark) font-bold">What Developers Say</h2>
        <div className="max-w-[1200px] mx-auto overflow-hidden">
          <div 
            className="flex"
            style={{
              transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`,
              transition: 'transform 0.6s ease-in-out'
            }}
            onTransitionEnd={() => {
              if (startIndex >= testimonials.length) {
                setStartIndex(0);
              }
            }}
          >
            {[...testimonials, ...testimonials.slice(0, VISIBLE_COUNT - 1)].map((testimonial, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                <div className="bg-white rounded-xl p-6 shadow-md h-full flex flex-col items-center">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.author} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent-blue mb-4"
                  />
                  <p className="italic mb-4 flex-grow">"{testimonial.text}"</p>
                  <p className="font-semibold text-accent-blue">— {testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Tech Stack / Trust Logos */}
      <section className="py-16 px-8 bg-white">
        <h2 className="text-center text-3xl md:text-4xl mb-10 text-[var(--primary-dark) font-semibold">Powered By</h2>
        <div className="max-w-[800px] mx-auto flex flex-wrap justify-center gap-4">
          {['React', 'Node.js', 'OpenAI API', 'PostgreSQL', 'Docker', 'Firebase'].map((tech) => (
            <div key={tech} className="px-4 py-2 rounded-full bg-gray-200 font-semibold hover:bg-[var(--primary-blue)] hover:text-white transition-colors">
              {tech} {tech === 'React' && <i className="fa-brands fa-react ml-1"></i>}
              {tech === 'Node.js' && <i className="fa-brands fa-node-js ml-1"></i>}
              {tech === 'Docker' && <i className="fa-brands fa-docker ml-1"></i>}
            </div>
          ))}
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-20 px-8 bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary-blue)] text-white text-center">
        <h2 className="text-3xl md:text-4xl mb-4">Ready to Test Your Skills and Get Certified?</h2>
        <p className="mb-8 opacity-90">Join thousands of developers improving their coding skills with Evalytics-AI</p>
        <Link to="/signup" className="inline-block px-8 py-4 rounded bg-[var(--accent-blue)] text-white font-medium text-lg hover:bg-[var(--primary-blue)] transition-colors">
          Sign Up & Start Learning Now
        </Link>
        <div className="inline-block mt-4 px-4 py-2 rounded-full bg-yellow-400 text-[var(--primary-dark)] text-sm font-bold">
          Earn points and badges!
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-[var(--primary-dark)] text-white py-12 px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="cursor-pointer" onClick={handleFooterLogoClick}>
            <img src="/eai.png" alt="Logo" width={100} />
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="relative text-white/70 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Privacy
            </Link>
            <Link to="/terms" className="relative text-white/70 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Terms
            </Link>
            <Link to="/github" className="relative text-white/70 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              GitHub
            </Link>
            <Link to="/linkedin" className="relative text-white/70 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              LinkedIn
            </Link>
            <a href="mailto:avijitrajak@gmail.com" className="relative text-white/70 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Contact
            </a>
          </div>
          <div className="flex gap-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-blue transition-colors">
              <i className="fa-brands fa-facebook text-xl"></i>
            </a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-blue transition-colors">
              <i className="fa-brands fa-x-twitter text-xl"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-blue transition-colors">
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
          © 2025 Evalytics-AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}