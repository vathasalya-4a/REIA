"use client";

import { useState } from 'react';
import { TrashIcon, ClipboardCheck, PencilIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ResumeUpload from "@/modules/checkats/components/ResumeUpload";
import JobDescription from "@/modules/checkats/components/JobDescription";
import AddCriteriaButton from "@/modules/checkats/components/AddCriteriaButton";
import EditCriteriaModal from "@/modules/checkats/components/EditCriteriaButton";
import AddCriteriaModal from "@/modules/checkats/components/AddCriteriaModal";
import LoadingDots from "@/components/icons/loading-dots";

interface CriteriaItem {
  name: string;
  percentage: number;
}

export default function CheckATS() {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setToastMessage(""); // Clear toast message when modal is closed
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
    setTotalPercentage(updatedCriteria.length === 0 ? 0 : newTotalPercentage); // Reset to 0 if no criteria left
  };

  const closeToast = () => {
    setToastMessage("");
  };

  const handleSubmit = async () => {
    /*closeToast();
  
    if (!resumeFile || (!jobDescriptionText && !jobDescriptionFile)) {
      toast({
        description: "Please upload a resume and provide the job description.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        description: "Compatibility score generated successfully!",
        variant: "default",
      });
    }, 2000);*/
    console.log("Hello");
    setToastMessage("Hello Welcome");
    return;
  }

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar p-6">

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
  {addedCriteria.map((item, index) => (
   <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2">
    <div
      key={index}
      className="mt-3 flex items-center justify-between p-4 rounded-lg bg-white border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-stone-700">{item.name}</span>
        <span className="text-xs text-stone-500">{item.percentage}%</span>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => openEditModal(item)} className="">
          <PencilIcon className="h-4 w-4 text-stone-500" aria-hidden="true" />
        </button>
        <button onClick={() => handleDeleteCriteria(index)} className="">
          <TrashIcon className="h-4 w-4 text-stone-500" aria-hidden="true" />
        </button>
      </div>
    </div>
    </div>
  ))}
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
          </div>
        </>
      )}
    </div>
  );
}
