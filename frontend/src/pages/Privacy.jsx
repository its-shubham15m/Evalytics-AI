import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-start py-16 px-5 bg-black bg-[url('/eai-square.png')] bg-cover bg-center bg-no-repeat md:bg-[url('/eai-square.png')]">
      <div className="max-w-4xl mx-auto p-8 bg-black/65 text-gray-100 font-['Segoe_UI'] rounded-2xl shadow-xl leading-relaxed backdrop-blur-md border border-white/10">
        <h1 className="text-4xl text-blue-400 mb-3">Privacy Policy</h1>
        <p className="mb-6">Last updated: June 17, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            At Evalytics-AI, your privacy is important to us. This privacy policy explains how we collect,
            use, disclose, and safeguard your information when you use our platform. By accessing or using
            Evalytics-AI, you agree to the terms outlined in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">2. Information We Collect</h2>
          <ul className="text-gray-300 list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and other details you provide during signup.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, browser type, and device information.</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your experience and analyze site traffic.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">3. How We Use Your Information</h2>
          <p className="text-gray-300 mb-2">We use your data to:</p>
          <ul className="text-gray-300 list-disc pl-5 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Improve user experience and product development</li>
            <li>Send you relevant updates and notifications</li>
            <li>Ensure compliance with legal requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">4. Sharing Your Information</h2>
          <p className="text-gray-300">
            We do not sell your personal information. We may share data with trusted third parties for hosting,
            analytics, and service delivery — all under strict confidentiality agreements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">5. Data Security</h2>
          <p className="text-gray-300">
            We implement industry-standard security measures to protect your data, including encryption,
            firewalls, and access controls. However, no online system is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">6. Your Rights</h2>
          <p className="text-gray-300 mb-2">You have the right to:</p>
          <ul className="text-gray-300 list-disc pl-5 space-y-2">
            <li>Access or update your personal information</li>
            <li>Request data deletion</li>
            <li>Opt-out of certain communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">7. Changes to This Policy</h2>
          <p className="text-gray-300">
            We may update this policy from time to time. We'll notify you of significant changes and post
            the new policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">8. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:avijitrajak1111@gmail.com" className="text-blue-400 hover:underline">Avijit</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;