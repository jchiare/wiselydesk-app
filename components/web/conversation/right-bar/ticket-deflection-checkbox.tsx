"use client";
import React, { useState } from "react";
import { NEXTJS_BACKEND_URL } from "@/lib/constants";

const TicketDeflected = ({
  ticketDeflected,
  publicConversationId,
  botId
}: {
  ticketDeflected: boolean | null;
  publicConversationId: string;
  botId: string;
}) => {
  const [isChecked, setIsChecked] = useState<boolean | null>(ticketDeflected);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);
    const updatedValue = !isChecked;

    try {
      const response = await fetch(
        `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${publicConversationId}/deflected`,
        {
          // Updated endpoint and ID
          method: "PATCH", // Updated method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ futureDeflectValue: updatedValue }) // Updated field name
        }
      );
      if (response.ok) {
        console.log("Ticket deflected status updated successfully");
      } else {
        const json = await response.json();
        console.error(`Error: ${json.message}`);
      }
    } catch (error) {
      console.error("Error updating ticket deflected status:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2 ">
      <input
        type="checkbox"
        id="ticket-deflection"
        checked={!!isChecked}
        onChange={handleCheckboxChange}
        className="form-checkbox h-5 w-5 accent-green-600 hover:cursor-pointer"
      />
      <label
        htmlFor="ticket-deflection"
        className="text-sm text-gray-700 hover:cursor-pointer">
        Ticket Deflected
      </label>
    </div>
  );
};

export default TicketDeflected;
