import React from 'react';

const Testimonials = () => (
  <section className="py-16 bg-gray-50 text-center px-4">
    <h2 className="text-4xl font-bold text-gray-800 mb-12">What Our Users Say</h2>
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-start">
        <p className="text-lg text-gray-700">&quot;REIA has transformed our hiring process. The ATS scoring is extremely accurate and helpful.&quot;</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div> {/* Placeholder for profile image */}
          <div className="text-left">
            <p className="font-bold text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">HR Manager</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-start">
        <p className="text-lg text-gray-700">&quot;Thanks to REIA, we can evaluate candidates quickly and make data-driven hiring decisions.&quot;</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div> {/* Placeholder for profile image */}
          <div className="text-left">
            <p className="font-bold text-gray-900">Jane Smith</p>
            <p className="text-sm text-gray-500">Recruiter</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
