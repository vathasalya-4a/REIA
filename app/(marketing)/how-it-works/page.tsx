// app/(marketing)/how-it-works/page.tsx
import React from 'react';

const HowItWorks = () => (
  <section className="py-16 bg-black text-center">
    <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
    <div className="space-y-4 text-gray-300">
      <div>1. <strong>Create Your Account</strong> - Sign up for a free account to start using Files 24.</div>
      <div>2. <strong>Upload Your Files</strong> - Easily upload files to your secure storage space.</div>
      <div>3. <strong>Invite Clients & Collaborators</strong> - Share files with clients and team members securely.</div>
      <div>4. <strong>Manage & Organize</strong> - Organize your files and monitor activities with ease.</div>
    </div>
  </section>
);

export default HowItWorks;
