import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen flex justify-center items-start py-16 px-5 bg-black bg-[url('eai-square.png')] bg-cover bg-center bg-no-repeat md:bg-[url('eai-square.png')]">
      <div className="max-w-4xl mx-auto p-8 bg-black/65 text-gray-100 font-['Segoe_UI'] rounded-2xl shadow-xl leading-relaxed backdrop-blur-md border border-white/10">
        <h1 className="text-4xl text-blue-400 mb-3 text-center border-b-2 border-blue-400 pb-3">Terms and Conditions</h1>
        <p className="text-gray-300 mb-8">Welcome to Evalytics-AI. By using our platform, you agree to the following terms and conditions.</p>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">1. Use of the Platform</h2>
          <p className="text-gray-300">
            You agree to use Evalytics-AI only for lawful purposes. You are responsible for any content you submit or
            generate using the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">2. Account Responsibilities</h2>
          <p className="text-gray-300">
            You are responsible for maintaining the confidentiality of your account credentials. You must notify us
            immediately if you suspect any unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">3. Intellectual Property</h2>
          <p className="text-gray-300">
            All content, branding, and code provided by Evalytics-AI are protected by copyright and intellectual property
            laws. You may not reuse or redistribute them without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">4. Limitations of Liability</h2>
          <p className="text-gray-300">
            Evalytics-AI is provided "as is" without warranties of any kind. We are not liable for any direct or indirect
            damages arising from your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">5. Changes to Terms</h2>
          <p className="text-gray-300">
            We reserve the right to update these terms at any time. Continued use of the platform indicates your
            acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl text-white mb-3 border-l-4 border-blue-400 pl-3">6. Contact</h2>
          <p className="text-gray-300">
            For any questions or concerns regarding these terms, please contact us at{' '}
            <a href="mailto:avijitrajak1111@gmail.com" className="text-blue-400 hover:underline">Avijit</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;