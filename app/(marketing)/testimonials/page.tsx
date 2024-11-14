// app/(marketing)/testimonials/page.tsx
import React from 'react';

const Testimonials = () => (
  <section className="py-16 bg-black text-center">
    <h2 className="text-3xl font-bold text-white mb-8">What Our Users Say</h2>
    <div className="space-y-8 text-gray-300">
      <div className="border border-gray-700 p-6 rounded-lg">
        <p>&quot;Files 24 has revolutionized the way I handle client documents. The client portal feature is a game-changer for my accounting practice.&quot;</p>
        <p className="mt-4 font-bold text-white">Emma Johnson, CPA, JD Accounting</p>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <p>&quot;The security and ease of use are unparalleled. I can collaborate with my team and clients seamlessly.&quot;</p>
        <p className="mt-4 font-bold text-white">Ava Williams, Legal Consultant</p>
      </div>
    </div>
  </section>
);

export default Testimonials;
