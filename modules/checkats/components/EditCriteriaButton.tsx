import React, { useState, useEffect } from 'react';
import { XIcon} from "lucide-react";

interface CriteriaItem {
  name: string;
  percentage: number;
}

interface EditCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CriteriaItem | null;
  onSave: (updatedItem: CriteriaItem) => void;
  totalPercentage: number;
}

const EditCriteriaModal: React.FC<EditCriteriaModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
  totalPercentage,
}) => {
  const [criteria, setCriteria] = useState<string>(item?.name || '');
  const [percentage, setPercentage] = useState<number>(item?.percentage || 0);
  const [localTotalPercentage, setLocalTotalPercentage] = useState<number>(totalPercentage || 0);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    setCriteria(item?.name || '');
    setPercentage(item?.percentage || 0);
    setLocalTotalPercentage(totalPercentage || 0);
  }, [item, totalPercentage]);

  const handleSaveChanges = () => {
    const currentPercentage = localTotalPercentage - (item?.percentage || 0) + percentage;

    if (currentPercentage > 100) {
      setToastMessage('Total percentage cannot exceed 100%. Please adjust values.');
    } else if (criteria && percentage) {
      const updatedItem = { name: criteria, percentage };
      onSave(updatedItem);
      setToastMessage('Criteria updated successfully!');
    } else {
      setToastMessage('Please select both criteria and percentage.');
    }
  };

  const handlePercentageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setPercentage(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const closeToast = () => setToastMessage('');

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-60 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-md bg-white dark:bg-black p-5 md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
        <div className="relative flex flex-col space-y-4">
          <div className="flex items-center justify-between mt-2">
            <h2 className="font-cal text-2xl dark:text-white">Edit Criteria</h2>
            <button onClick={onClose} className="ml-4 text-black">
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2 w-1/2">
              <label htmlFor="criteria" className="text-sm font-medium text-stone-500 dark:text-stone-400">Criteria</label>
              <input
                type="text"
                id="criteria"
                value={criteria}
                readOnly
                className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 focus:outline-none dark:border-stone-600 dark:bg-black dark:text-white"
              />
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

          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={handleSaveChanges}
              className="flex items-center justify-center w-md p-3 px-6 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
              Edit
            </button>
          </div>

          <div className="mt-4 text-center text-sm font-medium text-stone-500 dark:text-stone-400 mb-5">
            Total Percentage: {localTotalPercentage - (item?.percentage || 0) + percentage}%
          </div>
        </div>

        {toastMessage && (
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

export default EditCriteriaModal;
