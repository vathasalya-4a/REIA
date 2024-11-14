// app/(marketing)/why-choose/page.tsx
import React from 'react';

const WhyChoose = () => (
  <section className="py-16 bg-black text-center">
    <h2 className="text-3xl font-bold text-white mb-8">Why Choose Files 24?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">Top-Notch Security</h3>
        <p>Protect your files with end-to-end encryption and advanced security protocols.</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">Dedicated Client Portals</h3>
        <p>Invite clients to their own secure portals for seamless collaboration and file sharing.</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">Easy Collaboration</h3>
        <p>Invite team members to view and manage files with role-based permissions.</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">Organize Files Efficiently</h3>
        <p>Use folders, tags, and advanced search to keep your files organized and accessible.</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">Detailed Audit Logs</h3>
        <p>Track all file activities with comprehensive audit logs for compliance.</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="font-bold text-white mb-2">24/7 Support</h3>
        <p>Our dedicated support team is here to help you anytime you need assistance.</p>
      </div>
    </div>
  </section>
);

export default WhyChoose;
