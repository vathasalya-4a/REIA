"use client";

import { useState } from 'react';
import { TrashIcon, ClipboardCheck, EditIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ResumeUpload from "@/modules/checkats/components/ResumeUpload";
import JobDescription from "@/modules/checkats/components/JobDescription";
import AddCriteriaButton from "@/modules/checkats/components/AddCriteriaButton";
import EditCriteriaModal from "@/modules/checkats/components/EditCriteriaButton";
import AddCriteriaModal from "@/modules/checkats/components/AddCriteriaModal";

interface CriteriaItem {
  name: string;
  percentage: number;
}

export default function CheckATS() {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [addedCriteria, setAddedCriteria] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaItem | null>(null);

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

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar">

      <h1 className="mt-2 text-center font-cal text-3xl text-black-200">
        Upload Resume and Job Description
      </h1>

      <div className="mt-6 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
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
          setIsFileUpload={setIsFileUpload}
          handleJobDescriptionFileChange={handleJobDescriptionFileChange}
          handleRemoveJobDescriptionFile={handleRemoveJobDescriptionFile}
        />
      </div>

      <div className="mt-8 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
        <AddCriteriaButton 
          onClick={openModal} 
        />
        <AddCriteriaModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onAddCriteria={handleAddCriteria} 
          totalPercentage={totalPercentage}
        />
        <EditCriteriaModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          item={selectedCriteria}
          onSave={handleEditCriteria}
          totalPercentage={totalPercentage}
        />
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {addedCriteria.map((item, index) => (
            <div
              key={index}
              className="mt-3 flex items-center justify-between p-3 rounded-lg bg-white border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none"
            >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-stone-700">{item.name}</span>
              <span className="text-xs text-stone-500">{item.percentage}%</span>
            </div>
            <button onClick={() => openEditModal(item)} className="ml-14">
              <EditIcon className="h-4 w-4 text-stone-500" aria-hidden="true" />
            </button>
            <button onClick={() => handleDeleteCriteria(index)} className="">
              <TrashIcon className="h-4 w-4 text-stone-500" aria-hidden="true" />
            </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-9 flex justify-center">
        <button className="flex items-center rounded-lg border border-black hover:shadow-xl bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800">
          <ClipboardCheck className="h-5 w-5 mr-2" aria-hidden="true" />
          Get Compatibility Score
        </button>
      </div>

    </div>
  );
}
