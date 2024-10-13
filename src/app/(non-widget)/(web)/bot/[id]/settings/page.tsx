// Start of Selection
"use client";
import { BotSetting } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Fetch bot settings using TanStack Query
async function fetchBotSettings(botId: string): Promise<BotSetting> {
  const res = await fetch(`/api/bot/${botId}/business-hours/`);
  if (!res.ok) {
    throw new Error("Failed to fetch bot settings");
  }
  return res.json();
}

export default function BotSettingsPage({
  params
}: {
  params: { id: string };
}) {
  const botId = params.id;

  const {
    data: botSettings,
    isLoading,
    error
  } = useQuery<BotSetting, Error>({
    queryKey: ["botSettings", botId],
    queryFn: () => fetchBotSettings(botId),
    enabled: !!botId
  });

  if (isLoading) {
    return <div className="mt-8 text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500">
        Error loading settings.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-md bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Bot Settings
      </h1>
      {botSettings ? (
        <BotSettingsForm botSettings={botSettings} />
      ) : (
        <div className="text-center text-gray-500">No settings found.</div>
      )}
    </div>
  );
}

// Form Component for BotSettings
type BotSettingsFormProps = {
  botSettings: BotSetting;
};

function BotSettingsForm({ botSettings }: BotSettingsFormProps) {
  const [formData, setFormData] = useState({
    widget_start_hour: botSettings.widget_start_hour,
    widget_start_minute: botSettings.widget_start_minute,
    widget_end_hour: botSettings.widget_end_hour,
    widget_end_minute: botSettings.widget_end_minute,
    days_on: botSettings.days_on.split(",").map(day => parseInt(day, 10)),
    time_zone: botSettings.time_zone,
    is_active: botSettings.is_active
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (
      name === "widget_start_hour" ||
      name === "widget_start_minute" ||
      name === "widget_end_hour" ||
      name === "widget_end_minute"
    ) {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  function toggleDay(day: number) {
    setFormData(prev => {
      const isSelected = prev.days_on.includes(day);
      if (isSelected) {
        return { ...prev, days_on: prev.days_on.filter(d => d !== day) };
      } else {
        return { ...prev, days_on: [...prev.days_on, day] };
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setSubmitError(null);
    // Prepare data
    const payload = {
      botId: botSettings.bot_id,
      ...formData,
      days_on: formData.days_on.join(",")
    };
    // Send updated data to API
    try {
      const res = await fetch(
        `/api/bot/${botSettings.bot_id}/business-hours/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update bot settings");
      }
      setSuccessMessage("Bot settings updated successfully.");
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to update bot settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const dayOptions = [
    { label: "Monday", value: 0 },
    { label: "Tuesday", value: 1 },
    { label: "Wednesday", value: 2 },
    { label: "Thursday", value: 3 },
    { label: "Friday", value: 4 },
    { label: "Saturday", value: 5 },
    { label: "Sunday", value: 6 }
  ];

  const timeZoneOptions = [
    { label: "Berlin", value: "Europe/Berlin" },
    { label: "New York", value: "America/New_York" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-md bg-green-100 p-4">
          <svg
            className="h-5 w-5 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="flex items-center space-x-2 rounded-md bg-red-100 p-4">
          <svg
            className="h-5 w-5 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-red-700">{submitError}</span>
        </div>
      )}

      {/* Time Settings */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Start Time
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="number"
              name="widget_start_hour"
              value={formData.widget_start_hour}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={23}
              required
            />
            <span className="self-center text-gray-600">:</span>
            <input
              type="number"
              name="widget_start_minute"
              value={formData.widget_start_minute}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={59}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget End Time
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="number"
              name="widget_end_hour"
              value={formData.widget_end_hour}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={23}
              required
            />
            <span className="self-center text-gray-600">:</span>
            <input
              type="number"
              name="widget_end_minute"
              value={formData.widget_end_minute}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={59}
              required
            />
          </div>
        </div>
      </div>

      {/* Days On */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Days Active
        </label>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map(option => {
            const isSelected = formData.days_on.includes(option.value);
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => toggleDay(option.value)}
                className={`rounded border px-4 py-2 ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-sm text-gray-500">Select active days</p>
      </div>

      {/* Time Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Zone
        </label>
        <select
          name="time_zone"
          value={formData.time_zone}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 bg-white p-2 focus:border-blue-500 focus:ring-blue-500"
          required>
          <option value="">Select Time Zone</option>
          {timeZoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Is Active */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Is Active
        </label>
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 bg-white p-2 focus:border-blue-500 focus:ring-blue-500"
          required>
          <option value="widget_hours">Widget Hours</option>
          <option value="always">Always</option>
          <option value="never">Never</option>
        </select>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}>
          {isSubmitting ? "Updating..." : "Update Settings"}
        </button>
      </div>
    </form>
  );
}
