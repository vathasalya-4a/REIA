import React from 'react';
import Link from 'next/link';

const CTA = () => (
  <section className="flex flex-col items-center justify-center py-16 bg-white text-center px-4 ">
    <h2 className="text-4xl font-extrabold text-gray-500">Enhance Your Hiring with <span className="text-black">REIA</span></h2>
    <p className="text-gray-500 mt-4 text-lg">A powerful tool to evaluate resumes and streamline your recruitment process.</p>
    <div className="flex space-x-4 mt-6">
      <Link href="/register" passHref>
        <button className="bg-black hover:bg-gray-500 text-white font-semibold py-2 px-8 rounded-lg">Get Started</button>
      </Link>
      <button className="border border-black text-black hover:bg-blue-50 font-semibold py-2 px-8 rounded-lg">Learn More</button>
    </div>
  </section>
);

export default CTA;
