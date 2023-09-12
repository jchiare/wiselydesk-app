"use client";
import React, { useState } from "react";

const ToReview: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);

    // Your API call here
    // ...
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        id="toReview"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="form-checkbox h-5 w-5 accent-orange-600 hover:cursor-pointer"
      />
      <label
        htmlFor="toReview"
        className="text-sm text-gray-700 hover:cursor-pointer">
        To Review
      </label>
    </div>
  );
};

export default ToReview;
