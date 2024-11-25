// app/client/[id]/settings/layout.tsx
"use client";
import { ReactNode, useState } from "react";
import GeneralSettings from "@/modules/clientsettings/components/generalsettings";
import AccessSettings from "@/modules/clientsettings/components/access";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "url", label: "URL" },
    { id: "appearance", label: "Appearance" },
    { id: "access", label: "Access" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        {children}
        <a 
          href="https://files24.co/ai-star-logo/priyanka"
          className="text-gray-500 hover:text-gray-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://files24.co/ai-star-logo/priyanka ↗
        </a>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "access" && <AccessSettings />}
      </div>
    </div>
  );
}