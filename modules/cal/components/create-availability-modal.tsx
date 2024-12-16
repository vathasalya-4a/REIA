"use client";

import React, { useState } from "react";

const daysOfWeek = [
  { label: "Sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
  { label: "Monday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: "Tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: "Wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: "Thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: "Friday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: "Saturday", enabled: false, startTime: "09:00", endTime: "17:00" },
];

export default function CreateAvailabilityModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [availability, setAvailability] = useState(daysOfWeek);
  const [name, setName] = useState("");
  const [timeZone, setTimeZone] = useState("");

  const toggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const updateTime = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDays = availability
      .filter((day) => day.enabled)
      .map((day) => ({
        day: day.label,
        startTime: day.startTime,
        endTime: day.endTime,
      }));

    const data = { name, timeZone, availability: selectedDays };
    onSubmit(data); // Send data to parent
    onClose(); // Close the modal
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Availability</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter schedule name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
            Time Zone
          </label>
          <input
            type="text"
            id="timeZone"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your time zone (e.g., America/New_York)"
          />
        </div>

        <div className="flex flex-col space-y-4">
          {availability.map((day, index) => (
            <div key={day.label} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => toggleDay(index)}
                  className="h-5 w-5"
                />
                <label className="text-sm font-medium text-gray-700">{day.label}</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={day.startTime}
                  disabled={!day.enabled}
                  onChange={(e) => updateTime(index, "startTime", e.target.value)}
                  className={`rounded-md border-gray-300 shadow-sm sm:text-sm ${
                    !day.enabled && "bg-gray-200 cursor-not-allowed"
                  }`}
                />
                <span>-</span>
                <input
                  type="time"
                  value={day.endTime}
                  disabled={!day.enabled}
                  onChange={(e) => updateTime(index, "endTime", e.target.value)}
                  className={`rounded-md border-gray-300 shadow-sm sm:text-sm ${
                    !day.enabled && "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

