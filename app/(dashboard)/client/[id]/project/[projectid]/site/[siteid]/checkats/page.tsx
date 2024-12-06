"use client";

import { useState } from 'react';
import { TrashIcon, ClipboardCheck, PencilIcon,XIcon } from "lucide-react";
import { useSearchParams, useParams } from 'next/navigation'; 
import { ATSCompatibilityResult } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ResumeUpload from "@/modules/checkats/components/ResumeUpload";
import JobDescription from "@/modules/checkats/components/JobDescription";
import AddCriteriaButton from "@/modules/checkats/components/AddCriteriaButton";
import EditCriteriaModal from "@/modules/checkats/components/EditCriteriaButton";
import AddCriteriaModal from "@/modules/checkats/components/AddCriteriaModal";
import LoadingDots from "@/components/icons/loading-dots";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
console.log(pdfjsLib.GlobalWorkerOptions.workerSrc);

interface CriteriaItem {
  name: string;
  percentage: number;
}

export default function CheckATS() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [addedCriteria, setAddedCriteria] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [atsCompatibilityResults, setAtsCompatibilityResults] = useState<ATSCompatibilityResult[]>([]);

  const handleResumeFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setResumeFile(uploadedFile);
    }
  };

  const handleRemoveResumeFile = () => {
    setResumeFile(null);
  };

  const handleJobDescriptionFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setJobDescriptionFile(uploadedFile);
    }
  };

  const handleRemoveJobDescriptionFile = () => {
    setJobDescriptionFile(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCriteria("");
    setPercentage(0);
    setIsModalOpen(false);
    setToastMessage("");
    closeToast();
  };

  const openEditModal = (criteria: CriteriaItem) => {
    setSelectedCriteria(criteria);
    seteditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCriteria(null);
    seteditModalOpen(false);
  };

  const handleAddCriteria = (newCriteria) => {
    if (newCriteria && newCriteria.percentage && totalPercentage + newCriteria.percentage <= 100) {
      setAddedCriteria((prev) => [...prev, newCriteria]);
      const newTotalPercentage = totalPercentage + newCriteria.percentage;
      setTotalPercentage(newTotalPercentage);
      toast({
        description: `Total Percentage: ${newTotalPercentage}%\n${newCriteria.name} - ${newCriteria.percentage}%`
      });
    }
  };

  const handleEditCriteria = (updatedCriteria: CriteriaItem) => {
    setAddedCriteria((prev) =>
      prev.map((item) =>
        item.name === updatedCriteria.name ? updatedCriteria : item
      )
    );
    setTotalPercentage(
      prevTotal => prevTotal - (selectedCriteria?.percentage || 0) + updatedCriteria.percentage
    );
    closeEditModal();
  };

  const handleDeleteCriteria = (index) => {
    const updatedCriteria = [...addedCriteria];
    const removed = updatedCriteria.splice(index, 1)[0];
    setAddedCriteria(updatedCriteria);
    const newTotalPercentage = totalPercentage - removed.percentage;
    setTotalPercentage(updatedCriteria.length === 0 ? 0 : newTotalPercentage);
  };

  const closeToast = () => {
    setToastMessage("");
  };

  const extractText = async (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase(); // Get file extension
    const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
  
    if (fileExtension === "pdf") {
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      let resumeText = "";
  
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const pageContent = await page.getTextContent();
        const pageText = pageContent.items.map((item: any) => item.str).join(" ");
        resumeText += pageText;
      }
      return resumeText;
    } else if (fileExtension === "docx") {
      const uint8Array = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
      const { value: resumeText } = await mammoth.extractRawText({
        arrayBuffer: uint8Array.buffer, // Pass ArrayBuffer to mammoth
      });
      return resumeText;
    } else {
      throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
    }
  };  
  const handleSubmit = async () => {

    setLoading(true);
    setAtsCompatibilityResults([]);
  
    if (!resumeFile) {
      setToastMessage("Please upload Resume to get the Compatibility score");
      setLoading(false);
      return;
    }
  
    if (!jobDescriptionText && !jobDescriptionFile) {
      setToastMessage("Please provide Job Descrition to get the Compatibility score");
      setLoading(false);
      return;
    }
    if (addedCriteria.length === 0) {
      setToastMessage("Please add at least one crietria to check the Compatibility score");
      setLoading(false);
      return;
    }

    if (totalPercentage !== 100) {
      setToastMessage("The Maximum criteria percentage is not reached, please add more criteria");
      setLoading(false);
      return;
    }
  
    closeToast();

  
  try {
    let finalJobDescription = jobDescriptionText;
    let jobFileBuffer = null;
    let jobFileName = null;
  
    if (jobDescriptionFile) {
      finalJobDescription = await extractText(jobDescriptionFile);
    }


    console.log(finalJobDescription);
    const candidateId = params?.siteid;
    const resumeUploads = [];
    const fileBuffer = await resumeFile.arrayBuffer();
    const base64FileBuffer = Buffer.from(fileBuffer).toString("base64");

    // API Call to upload Resume to S3 bucket and to the database
   const uploadResponse = await fetch("/api/upload-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: resumeFile.name,
        fileBuffer: base64FileBuffer,
        candidateId,
        jobDescription: finalJobDescription,
        JobBuffer: jobFileBuffer,
        Jobfilename: jobFileName
      }),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Error uploading resume: ${resumeFile.name}`);
    } 

    const uploadResult = await uploadResponse.json();
    console.log("Uploaded resume and job description:", uploadResult.fileUrl);
    console.log("Resume ID:", uploadResult.resumeId);

    const resumeText = await extractText(resumeFile);
    resumeUploads.push({
      text: resumeText,
      fileName: resumeFile.name,
      resumeId: uploadResult.resumeId,
    });

    const resumeTexts = resumeUploads.map((resume) => resume.text);
    const fileNames = resumeUploads.map((resume) => resume.fileName);
    const resumeId = resumeUploads.map((resume) => resume.resumeId);

    console.log(resumeText);

    const atsResponse = await fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription: finalJobDescription,
        resumeTexts,
        fileNames,
        weights: addedCriteria,
        candidateId,
        resumeId,
        flag: 0,
      }),
    });

    if (!atsResponse.ok) {
      throw new Error("Error processing Compatibility Score");
    }

    const atsResult = await atsResponse.json();
    setAtsCompatibilityResults(atsResult.atsCompatibilityResults);
    console.log(atsCompatibilityResults)
  } catch (error) {
    console.error("Error during submission:", error);
    setToastMessage("Failed to process ATS check. Please try again.");
  } finally {
    setLoading(false);
  }
};   

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar p-2">

      <h1 className="mt-3 text-center font-cal text-3xl text-black-200">
        Upload Resume and Job Description
      </h1>

      <div className="mt-8 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
        <p className="mt-2 text-sm text-gray-500 text-center">
          Accepted File types are docx and pdf
        </p>
        <ResumeUpload
          resumeFile={resumeFile}
          handleResumeFileChange={handleResumeFileChange}
          handleRemoveResumeFile={handleRemoveResumeFile}
        />
        <JobDescription
          isFileUpload={isFileUpload}
          jobDescriptionFile={jobDescriptionFile}
          jobDescriptionText={jobDescriptionText}
          setJobDescriptionText={setJobDescriptionText}
          setIsFileUpload={setIsFileUpload}
          handleJobDescriptionFileChange={handleJobDescriptionFileChange}
          handleRemoveJobDescriptionFile={handleRemoveJobDescriptionFile}
        />
      </div>

      {resumeFile && (
        <>
          <div className="mt-10 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            <AddCriteriaButton 
              onClick={openModal} 
            />
            <AddCriteriaModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              onAddCriteria={handleAddCriteria} 
              totalPercentage={totalPercentage}
              addedCriteria={addedCriteria}
            />
            <EditCriteriaModal
              isOpen={editModalOpen}
              onClose={closeEditModal}
              item={selectedCriteria}
              onSave={handleEditCriteria}
              totalPercentage={totalPercentage}
            />
 {addedCriteria.length > 0 && (
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2">
    {addedCriteria.map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-4 rounded-lg bg-white border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-stone-700">
            {item.name}
          </span>
          <span className="text-xs text-stone-500">{item.percentage}%</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => openEditModal(item)}>
          <PencilIcon className="h-4 w-4 text-stone-500 hover:text-black" aria-hidden="true" />
          </button>
          <button onClick={() => handleDeleteCriteria(index)}>
            <TrashIcon className="h-4 w-4 text-stone-500 hover:text-black" aria-hidden="true" />
          </button>
        </div>
      </div>
    ))}
  </div>
)}
          </div>

          <div className="mt-11 flex justify-center">
            <button 
              disabled = {loading}
              onClick={handleSubmit}
              className={`${ loading ? "cursor-not-allowed bg-gray-600" : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
              } flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800`}
              >
              {loading ? 
                (
                  <div className="flex items-center">
                    <LoadingDots color="#A8A29E" /> 
                    <p className="ml-2 text-sm font-medium">Checking Compatibility...</p>
                  </div>
                ) : 
                (
                  <div className="flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2" aria-hidden="true" />
                    <p className="text-sm font-medium">Get Compatibility Score</p>
                  </div>
              )}
            </button>
            {
            toastMessage && (
              <div className="fixed bottom-4 right-6 bg-white text-black p-5 rounded-lg shadow-lg flex flex-col items-start justify-center w-[332px] h-auto border border-gray-300 transition group">
                <button
                  onClick={closeToast}
                  className="absolute top-2 right-2 text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition">
                  <XIcon className="h-3 w-3" aria-hidden="true" />
                </button>
                <span className="text-left m-0 p-0 leading-normal font-bold text-red-700">Error</span>
                <span className="text-left m-0 p-0 leading-normal">{toastMessage}</span>
              </div>
            )
            }
          </div>
          {atsCompatibilityResults.map((result, index) => {
  const score = result.atsCompatibilityScore;
  const summary = result.summary;
  const suggestions = summary
    .split("\n")
    .filter((line) => line.trim().startsWith("-"));

  return (
     <div key={index} className="mt-11 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <h4 className="mt-3 text-center font-cal text-2xl text-black-200">
        Compatibility Results
      </h4>
      <div className="flex flex-col items-center pt-8">
        <div className="relative w-32 h-32">
          <svg className="absolute top-0 left-0 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#d9d9d9"
              strokeWidth="10"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#4caf50"
              strokeWidth="10"
              strokeDasharray="100"
              strokeDashoffset={`${100 - score}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {score}%
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-800">
          Score: {score} out of 100
        </p>
      </div>
      <h6 className="mt-3 pt-3 text-center font-cal text-2xl text-black-200">
          Summary
      </h6>
      <div className="pl-4 pr-4 justify-content pt-2 mb-4">
        <ul className="mt-4 space-y-4 text-gray-600 list-disc pl-5">
          {suggestions.map((point, pointIndex) => (
            <li key={`${index}-${pointIndex}`} className="pl-2 text-gray-700 leading-relaxed">
              {point.trim().replace(/^-/, "").trim()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
})}
        </>
      )}
    </div>
  );
}
