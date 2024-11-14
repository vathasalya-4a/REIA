// app/(marketing)/get-started/page.tsx
import React from 'react';

const GetStarted = () => (
  <section className="flex flex-col items-center justify-center py-16 bg-black text-center">
    <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
    <p className="text-gray-400 mt-4">Sign up today and take the first step towards secure and efficient file management.</p>
    <button className="mt-6 bg-white text-black font-semibold py-2 px-6 rounded">Create Free Account</button>
  </section>
);

export default GetStarted;
