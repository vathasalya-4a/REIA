import React, { useState, useEffect } from 'react';
import { XIcon} from "lucide-react";

interface AddCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCriteria: (item: { name: string; percentage: number }) => void;
  totalPercentage: number;
}

const AddCriteriaModal: React.FC<AddCriteriaModalProps> = ({ isOpen, onClose, onAddCriteria, totalPercentage }) => {
  const [criteria, setCriteria] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [localTotalPercentage, setLocalTotalPercentage] = useState<number>(totalPercentage || 0);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [addedCriteria, setAddedCriteria] = useState<{ name: string; percentage: number }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const criteriaOptions = [
    { label: "Select criteria", value: "" },
    { label: "Skills Matching", value: "skills_matching" },
    { label: "Experience", value: "experience" },
    { label: "Education", value: "education" },
    { label: "Keyword Usage", value: "keyword_usage" },
    { label: "Certifications", value: "certifications" },
    { label: "Achievements", value: "achievements" },
    { label: "Job Stability", value: "job_stability" },
    { label: "Cultural Fit", value: "cultural_fit" },
  ];

  useEffect(() => {
    setLocalTotalPercentage(totalPercentage || 0); // Update local total on prop change
  }, [totalPercentage]);

  const handleAddCriteria = () => {
    if (localTotalPercentage === 100) {
      setToastMessage('Maximum criteria reached. No more criteria can be added.');
    } else if (localTotalPercentage + percentage > 100 && localTotalPercentage < 100) {
      setToastMessage('Total percentage reached. Please adjust values.');
    } else if (criteria && percentage) {
      const newCriteria = { name: criteria, percentage };
      setAddedCriteria([...addedCriteria, newCriteria]);
      onAddCriteria(newCriteria);
      setLocalTotalPercentage((prev) => prev + percentage);
      setToastMessage('Criteria added successfully!');
      setCriteria('');
      setPercentage(0);
    } else {
      setToastMessage('Please select both criteria and percentage.');
    }
  };

  const handlePercentageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setPercentage(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const closeToast = () => setToastMessage('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-60 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-md bg-white dark:bg-black p-5 md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
        <div className="relative flex flex-col space-y-4">

          <div className="flex items-center justify-between mt-4">
            <h2 className="font-cal text-2xl dark:text-white">Add Criteria</h2>
            <button onClick={onClose} className="ml-4 text-black">
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2 w-1/2">
              <label htmlFor="criteria" className="text-sm font-medium text-stone-500 dark:text-stone-400">Choose Criteria</label>
              <select
                id="criteria"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white"
              >
                {criteriaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2 w-1/2">
              <label htmlFor="percentage" className="text-sm font-medium text-stone-500 dark:text-stone-400">Select Percentage</label>
              <select
                id="percentage"
                value={percentage}
                onChange={(e) => handlePercentageChange(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white"
              >
                {[...Array(21)].map((_, index) => (
                  <option key={index} value={index * 5}>{index * 5}%</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-4">
            <button 
              onClick={handleAddCriteria} 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              Add
            </button>
            <button 
              onClick={toggleDropdown} 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              View
            </button>
          </div>

          {isDropdownOpen && (
  <div className="mt-4 border rounded-lg bg-stone-50 dark:bg-black p-3">
    <div className="mt-1 grid grid-cols-3 gap-2">
      {addedCriteria.length > 0 ? (
        addedCriteria.map((item, index) => (
          <div 
            key={index} 
            className="p-1 bg-white dark:bg-stone-800 rounded-lg shadow-md border border-stone-200 dark:border-stone-700"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-stone-700 dark:text-stone-300">{item.name}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">{item.percentage}%</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-stone-500 dark:text-stone-400 col-span-full">No criteria added yet.</p>
      )}
    </div>
  </div>
)}

          <div className="mt-4 text-center text-sm font-medium text-stone-500 dark:text-stone-400">
            Total Percentage: {localTotalPercentage}%
          </div>

        </div>

        {
        toastMessage && (
          <div className="fixed bottom-5 right-5 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <span>{toastMessage}</span>
            <button onClick={closeToast} className="ml-4 text-black">
              <XIcon className="h-2 w-2" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCriteriaModal;
