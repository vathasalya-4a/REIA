"use client";

import { useState } from 'react';
import { UploadCloudIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CheckATS() {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [addedCriteria, setAddedCriteria] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message

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
  const closeModal = () => {
    setCriteria("");
    setPercentage(0);
    setIsModalOpen(false);
    setToastMessage(""); // Clear toast message when modal is closed
  };

  const handleAddCriteria = () => {
    if (criteria && percentage && totalPercentage + percentage <= 100) {
      const newCriteria = { name: criteria, percentage: percentage };
      setAddedCriteria([...addedCriteria, newCriteria]);
      setTotalPercentage(totalPercentage + percentage);

      // Display toast inside the modal with white background and black text
      setToastMessage(`Total Percentage: ${totalPercentage + percentage}%\nAdded ${criteria} with ${percentage}%`);
      setTimeout(() => setToastMessage(""), 60000); // Hide toast after 60 seconds
    }
  };

  const handleDeleteCriteria = (index) => {
    const updatedCriteria = [...addedCriteria];
    const removed = updatedCriteria.splice(index, 1)[0];
    setAddedCriteria(updatedCriteria);
    setTotalPercentage(totalPercentage - removed.percentage);
  };

  const closeToast = () => {
    setToastMessage("");
  };

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar">
      <h1 className="mt-2 text-center font-cal text-3xl text-black-200">
        Upload Resume and Job Description
      </h1>
      <div className="mt-6 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
        <p className="mt-2 text-sm text-gray-500 text-center">
          Accepted File types are docx and pdf
        </p>
        
        {/* File Upload Sections */}
        <div className="mt-5 flex justify-center">
          {resumeFile ? (
            <div className="flex items-center p-2 bg-white border border-gray rounded-lg w-full max-w-md">
              <p className="text-black flex-grow truncate">{resumeFile.name}</p>
              <button onClick={handleRemoveResumeFile} className="ml-2">
                <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-4/7 p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Upload Resume</span>
              <input type="file" onChange={handleResumeFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Job Description Section */}
        <div className="mt-8 flex flex-col items-center">
          {!isFileUpload ? (
            <div className="w-5/6">
              <textarea className="w-full max-h-40 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
                rows={4}
                placeholder="Enter job description here..."></textarea>
              <p className="mt-4 text-sm text-gray-500 text-center mb-4">
                Have a file?{' '}
                <button onClick={() => setIsFileUpload(true)} className="text-blue-600 underline hover:text-blue-800">
                  Upload your job description directly instead.
                </button>
              </p>
            </div>
          ) : jobDescriptionFile ? (
            <div className="flex items-center p-2 bg-white border border-gray rounded-lg w-full max-w-md">
              <p className="text-black flex-grow truncate">{jobDescriptionFile.name}</p>
              <button onClick={handleRemoveJobDescriptionFile} className="ml-2">
                <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-2/5 p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Upload Job Description</span>
              <input type="file" onChange={handleJobDescriptionFileChange} className="hidden" />
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

      {/* Add Criteria Button and Criteria List */}
      <div className="mt-8 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
  <div className="flex justify-center mb-2"> {/* Changed `mt-8` to `mb-2` */}
    <button onClick={openModal} className="flex items-center justify-center w-40 p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
      <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
      <span>Add Criteria</span>
    </button>
  </div>

        {/* Display Added Criteria */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {addedCriteria.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between p-3 bg-white border-black rounded-md shadow-md transition-transform transform hover:scale-105"
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-stone-700">
          {item.name}
        </span>
        <span className="text-xs text-stone-500">
          {item.percentage}%
        </span>
      </div>
      <button onClick={() => handleDeleteCriteria(index)} className="ml-2">
        <TrashIcon className="h-4 w-4 text-stone-500" aria-hidden="true" />
      </button>
    </div>
  ))}
</div>
      </div>
      
      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-60 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-md bg-white dark:bg-black p-5 md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
            <div className="relative flex flex-col space-y-4">
              <h2 className="font-cal text-2xl dark:text-white">Add Criteria</h2>
              <div className="flex flex-row space-x-4">
                {/* Criteria Selection */}
                <div className="flex flex-col space-y-2 w-1/2">
                  <label htmlFor="criteria" className="text-sm font-medium text-stone-500 dark:text-stone-400">Choose Criteria</label>
                  <select value={criteria} onChange={(e) => setCriteria(e.target.value)} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white">
                    <option value="">Choose an option</option>
                    <option value="Education">Education</option>
                    <option value="Experience">Experience</option>
                    <option value="Technical Skills">Technical Skills</option>
                  </select>
                </div>
                {/* Percentage Selection */}
                <div className="flex flex-col space-y-2 w-1/2">
                  <label htmlFor="percentage" className="text-sm font-medium text-stone-500 dark:text-stone-400">Select Percentage</label>
                  <select value={percentage} onChange={(e) => setPercentage(parseInt(e.target.value))} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white">
                    {[...Array(21)].map((_, index) => (
                      <option key={index} value={index * 5}>{index * 5}%</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button onClick={handleAddCriteria} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Add</button>
                <button onClick={closeModal} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Close</button>
              </div>
            </div>

            {/* Toast Notification Inside Modal at Bottom-Right */}
            {toastMessage && (
              <div className="fixed bottom-5 right-5 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                <span>{toastMessage}</span>
                <button onClick={closeToast} className="ml-4 text-black">
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
