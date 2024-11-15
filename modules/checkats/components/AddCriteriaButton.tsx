import React from 'react';
import { PlusIcon} from "lucide-react";

interface AddCriteriaButtonProps {
  onClick: () => void;
}

const AddCriteriaButton: React.FC<AddCriteriaButtonProps> = ({ onClick }) => (
  <div className="flex justify-center">
    <button
      onClick={onClick}
      className="flex items-center justify-center w-40 p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800"
    >
    <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
    <span>Add Criteria</span>
    </button>
  </div>
);

export default AddCriteriaButton;
