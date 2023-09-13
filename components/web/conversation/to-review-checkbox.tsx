"use client";
import React, { useState } from "react";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";

const ToReview = ({
  toReview,
  conversationId,
  botId
}: {
  toReview: boolean | null;
  conversationId: string;
  botId: string;
}) => {
  const [isChecked, setIsChecked] = useState<boolean | null>(toReview);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);
    const updatedValue = !isChecked;

    try {
      const response = await fetch(
        `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${conversationId}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ futureReviewValue: updatedValue })
        }
      );
      if (response.ok) {
        console.log("Ticket Review status updated successfully");
      } else {
        const json = await response.json();
        console.error(`Error: ${json.message}`);
      }
    } catch (error) {
      console.error("Error updating ticket Review status:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        id="toReview"
        type="checkbox"
        checked={!!isChecked}
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
