// modules/clientsettings/components/generalsettings.tsx
"use client";
import { useState } from 'react';

export default function GeneralSettings() {
  const [name, setName] = useState('Priyanka');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-6">
      {/* Name Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Name</h2>
          <p className="text-sm text-gray-500">The name of your client.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md mt-2"
            placeholder="Enter client name"
          />
          <p className="text-sm text-gray-500 mt-4">Please use 32 characters maximum.</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-sm text-gray-500">The description of your client's business.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md mt-2 min-h-[100px]"
            placeholder="description"
          />
          <p className="text-sm text-gray-500 mt-4">This shall help you categorize your clients.</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}