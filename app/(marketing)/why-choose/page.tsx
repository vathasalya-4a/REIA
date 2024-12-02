import React from 'react';

const WhyChoose = () => (
  <section className="py-16 bg-white text-center px-4">
    <h2 className="text-4xl font-bold text-gray-500 mb-12">Why Choose <span className="text-black">REIA</span>?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600">
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Accurate ATS Scoring</h3>
        <p>Evaluate resumes with precise ATS scores to streamline hiring.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Resume Modification</h3>
        <p>Generate improved resumes based on criteria and templates.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Candidate Management</h3>
        <p>Manage candidate profiles and store relevant data securely.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Collaboration</h3>
        <p>Work with team members to evaluate and manage candidates.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Evaluation Logs</h3>
        <p>Keep track of evaluation actions and resume modifications.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
        <p>Our support team is here to assist you anytime.</p>
      </div>
    </div>
  </section>
);

export default WhyChoose;
