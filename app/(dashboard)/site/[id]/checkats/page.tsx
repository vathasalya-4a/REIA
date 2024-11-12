"use client";

import { useState } from 'react';
import { UploadCloudIcon, EyeIcon, XIcon, PlusIcon } from "lucide-react";

export default function CheckATS() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResumeFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setResumeFile(uploadedFile);
    }
  };

  const handleJobDescriptionFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setJobDescriptionFile(uploadedFile);
    }
  };

  const handleRemoveResumeFile = () => {
    setResumeFile(null);
  };

  const handleRemoveJobDescriptionFile = () => {
    setJobDescriptionFile(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar">
      <h1 className="mt-2 text-center font-cal text-3xl text-black-200">
        Upload Resume and Job Description
      </h1>
      <div className="mt-6 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
        <p className="mt-2 text-sm text-gray-500 text-center">
          Accepted File types are docx and pdf
        </p>
        {/* Upload Resume Section */}
        <div className="mt-5 flex justify-center">
          {resumeFile ? (
            <div className="flex items-center p-2 bg-white border border-gray rounded-lg w-full max-w-md">
              <p className="text-black flex-grow truncate">{resumeFile.name}</p>
              <button className="ml-2">
                <EyeIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
              <button onClick={handleRemoveResumeFile} className="ml-2">
                <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-4/7 p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Upload Resume</span>
              <input
                type="file"
                onChange={handleResumeFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {/* Job Description Section */}
        <div className="mt-8 flex flex-col items-center">
          {!isFileUpload ? (
            <div className="w-5/6">
              <textarea
                className="w-full max-h-40 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
                rows={4}
                placeholder="Enter job description here..."
              ></textarea>
              <p className="mt-4 text-sm text-gray-500 text-center mb-4">
                Have a file?{' '}
                <button
                  onClick={() => setIsFileUpload(true)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Upload your job description directly instead.
                </button>
              </p>
            </div>
          ) : jobDescriptionFile ? (
            <div className="flex items-center p-2 bg-white border border-gray rounded-lg w-full max-w-md">
              <p className="text-black flex-grow truncate">{jobDescriptionFile.name}</p>
              <button className="ml-2">
                <EyeIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
              <button onClick={handleRemoveJobDescriptionFile} className="ml-2">
                <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-2/5 p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Upload Job Description</span>
              <input
                type="file"
                onChange={handleJobDescriptionFileChange}
                className="hidden"
              />
            </label>
          )}
          {isFileUpload && !jobDescriptionFile && (
            <p className="mt-4 text-sm text-gray-500 text-center mb-4">
              Prefer typing?{' '}
              <button
                onClick={() => setIsFileUpload(false)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Switch to copy/pasting your job description instead.
              </button>
            </p>
          )}
        </div>
      </div>
      <div className="mt-8 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
        <div className="flex justify-center">
          <button
            onClick={openModal}
            className="flex items-center justify-center w-40 p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            <span>Add Criteria</span>
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-60 bg-opacity-20 backdrop-blur-md">
          <div className="w-full max-w-md rounded-md bg-white dark:bg-black md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
            <div className="relative flex flex-col space-y-4 p-5 md:p-10">
              <h2 className="font-cal text-2xl dark:text-white">Select Criteria</h2>

              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="criteria"
                  className="text-sm font-medium text-stone-500 dark:text-stone-400"
                >
                  Choose an option
                </label>
                <select
                  name="criteria"
                  className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white"
                >
                  <option value="">Choose an option</option>
                  <option value="criteria1">Education</option>
                  <option value="criteria2">Experience</option>
                  <option value="criteria3">Technical Skills</option>
                  
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
              <button
                onClick={closeModal}
                className="flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
