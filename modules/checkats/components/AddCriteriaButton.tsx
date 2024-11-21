import React from 'react';
import { PlusIcon} from "lucide-react";

interface AddCriteriaButtonProps {
  onClick: () => void;
}

const AddCriteriaButton: React.FC<AddCriteriaButtonProps> = ({ onClick }) => (
  <div className="mt-2 flex justify-center mb-2">
    <button
      onClick={onClick}
      className="flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800"
    >
    <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
    <span>Add Criteria</span>
    </button>
  </div>
);

export default AddCriteriaButton;
