import React from 'react';

const HowItWorks = () => (
  <section className="py-16 bg-gray-50 px-4 text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
    <div className="space-y-8 text-gray-700 max-w-3xl mx-auto">
      <div className="flex items-start md:items-center space-x-4 md:space-x-6">
        <div className="flex-shrink-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">Create Your Account</h3>
          <p className="text-gray-600">Sign up to start using REIA.</p>
        </div>
      </div>
      <div className="flex items-start md:items-center space-x-4 md:space-x-6">
        <div className="flex-shrink-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">Create Candidates</h3>
          <p className="text-gray-600">Add new candidates to the platform.</p>
        </div>
      </div>
      <div className="flex items-start md:items-center space-x-4 md:space-x-6">
        <div className="flex-shrink-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">Upload Resumes and Job Descriptions</h3>
          <p className="text-gray-600">Add resumes and job descriptions for evaluation.</p>
        </div>
      </div>
      <div className="flex items-start md:items-center space-x-4 md:space-x-6">
        <div className="flex-shrink-0 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">Evaluate and Generate Scores</h3>
          <p className="text-gray-600">Set criteria, get ATS scores, and generate improved resumes.</p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
