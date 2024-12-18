// ResumeUpload Component
import React from 'react';
import { UploadCloudIcon, XIcon } from "lucide-react";

interface ResumeUploadProps {
  resumeFile: File | null;
  handleRemoveResumeFile: () => void;
  handleResumeFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  resumeFile,
  handleRemoveResumeFile,
  handleResumeFileChange,
}) => {
  return (
    <div className="mt-7 flex justify-center">
      {!resumeFile ? (
        <label className="flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
          <UploadCloudIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          <span>Upload Resume</span>
          <input type="file" onChange={handleResumeFileChange} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center p-2 bg-white border border-gray rounded-lg w-full max-w-md">
          <p className="text-black flex-grow truncate">{resumeFile.name}</p>
          <button onClick={handleRemoveResumeFile} className="ml-2">
            <XIcon className="h-5 w-5 text-black" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
