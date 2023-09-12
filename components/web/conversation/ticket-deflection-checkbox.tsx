"use client";
import React, { useState } from "react";

const TicketDeflected: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);

    try {
      const response = await fetch("http://api.example.com/ticket_deflected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_deflected: !isChecked })
      });
      if (response.ok) {
        console.log("Ticket deflected status updated successfully");
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
        checked={isChecked}
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
