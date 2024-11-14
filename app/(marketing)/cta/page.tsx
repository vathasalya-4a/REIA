// app/(marketing)/cta/page.tsx
import React from 'react';

const CTA = () => (
  <section className="flex flex-col items-center justify-center py-16 bg-black text-center">
    <h2 className="text-3xl font-bold text-white">Securely Share and Store Your Files with Files 24</h2>
    <p className="text-gray-400 mt-4">The secure, efficient, and professional way to manage your files and collaborate with clients.</p>
    <div className="flex space-x-4 mt-6">
      <button className="bg-white text-black font-semibold py-2 px-6 rounded">Get Started</button>
      <button className="border border-white text-white font-semibold py-2 px-6 rounded">Learn More</button>
    </div>
  </section>
);

export default CTA;
