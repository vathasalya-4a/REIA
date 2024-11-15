import React from 'react';
import Link from 'next/link';

const GetStarted = () => (
  <section className="flex flex-col items-center justify-center py-16 bg-white text-center px-4">
    <h2 className="text-4xl font-bold text-gray-800">Ready to Get Started?</h2>
    <p className="text-gray-500 mt-4 text-lg">Sign up today and take the first step towards secure and efficient file management.</p>
    <Link href="/register" passHref>
      <button className="mt-6 bg-black text-white font-semibold py-3 px-8 rounded-md text-lg hover:bg-gray-500 transition-colors">
        Create Free Account
      </button>
    </Link>
  </section>
);

export default GetStarted;
