// JobDescription Component
import React from 'react';
import { XIcon, UploadCloudIcon } from "lucide-react";

interface JobDescriptionProps {
  isFileUpload: boolean;
  setIsFileUpload: (value: boolean) => void;
  jobDescriptionFile: File | null;
  jobDescriptionText: string | null;
  setJobDescriptionText: (value: string) => void;
  handleRemoveJobDescriptionFile: () => void;
  handleJobDescriptionFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  isFileUpload,
  jobDescriptionFile,
  jobDescriptionText,
  setIsFileUpload,
  setJobDescriptionText,
  handleJobDescriptionFileChange,
  handleRemoveJobDescriptionFile,
}) => {
  return (
    <div className="mt-8 flex justify-center">
      {!isFileUpload ? (
        <div className="w-full max-w-lg text-center">
          <textarea
            className="w-full max-h-80 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
            rows={4}
            placeholder="Enter the job description here..."
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
          ></textarea>
          <p className="mt-6 text-sm text-gray-500">
            Have a file?{' '}
            <button
              onClick={() => setIsFileUpload(true)}
              className="text-gray underline hover:text-gray-500 mb-4 "
            >
              Upload your job description directly instead.
            </button>
          </p>
        </div>
      ) : (
        <div className="w-md max-w-lg text-center">
          {jobDescriptionFile ? (
            <div className="flex items-center justify-between p-2 bg-white border border-gray-300 rounded-lg">
              <p className="text-black flex-grow truncate">{jobDescriptionFile.name}</p>
              <button onClick={handleRemoveJobDescriptionFile} className="ml-2">
                <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-center">Upload Job Description</span>
              <input type="file" onChange={handleJobDescriptionFileChange} className="hidden" />
            </label>
          )}
          <p className="mt-6 text-sm text-gray-500">
            Prefer typing?{' '}
            <button
              onClick={() => setIsFileUpload(false)}
              className="text-gray-500 underline hover:text-gray-500 mb-4"
            >
              Switch to copy/pasting your job description instead.
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
