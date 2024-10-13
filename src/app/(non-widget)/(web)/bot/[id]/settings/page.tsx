"use client";
import { BotSetting } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

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
    <div className="mx-auto flex max-w-4xl flex-col justify-center p-6">
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
    business_start_hour: botSettings.business_start_hour,
    business_start_minute: botSettings.business_start_minute,
    business_end_hour: botSettings.business_end_hour,
    business_end_minute: botSettings.business_end_minute,
    days_on: botSettings.days_on.split(",").map(day => parseInt(day, 10)),
    time_zone: botSettings.time_zone,
    visibility: botSettings.visibility
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (
      name === "business_start_hour" ||
      name === "business_start_minute" ||
      name === "business_end_hour" ||
      name === "business_end_minute"
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
    setIsSuccess(false);
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
      setIsSuccess(true);
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

  const isDisabled =
    formData.visibility === "always" || formData.visibility === "never";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="flex items-center space-x-2 rounded-md bg-red-100 p-3">
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
      <div className="flex rounded-md bg-white p-4 shadow-md">
        <div className="w-full md:w-1/3">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="is_active"
                className="block cursor-pointer text-lg font-medium text-gray-700">
                Widget Visibility
              </label>
              <select
                id="is_active"
                name="is_active"
                value={formData.visibility}
                onChange={handleChange}
                className={`mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formData.visibility === "always"
                    ? "bg-green-100"
                    : formData.visibility === "never"
                      ? "bg-red-100"
                      : "bg-white"
                }`}
                required>
                <option value="widget_hours">Outside Business Hours</option>
                <option value="always">Always</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className={`border-b p-4 pb-6 ${isDisabled ? "bg-gray-100" : ""}`}>
        <h2 className="mb-4 text-lg font-medium text-gray-800">
          Business Hours
        </h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <div
            className={`flex-1 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="business_start_hour"
                value={formData.business_start_hour}
                onChange={handleChange}
                className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={23}
                required
                disabled={isDisabled}
              />
              <span className="text-gray-600">:</span>
              <input
                type="number"
                name="business_start_minute"
                value={formData.business_start_minute}
                onChange={handleChange}
                className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={59}
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          <div
            className={`flex-1 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="business_end_hour"
                value={formData.business_end_hour}
                onChange={handleChange}
                className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={23}
                required
                disabled={isDisabled}
              />
              <span className="text-gray-600">:</span>
              <input
                type="number"
                name="business_end_minute"
                value={formData.business_end_minute}
                onChange={handleChange}
                className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={59}
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          <div
            className={`flex-1 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select
              name="time_zone"
              value={formData.time_zone}
              onChange={handleChange}
              className="mt-1 w-fit rounded border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isDisabled}>
              <option value="">Select Time Zone</option>
              {timeZoneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={`border-b p-4 pb-6 ${isDisabled ? "bg-gray-100" : ""}`}>
        <h2 className="mb-4 text-lg font-medium text-gray-800">Days Active</h2>
        <div
          className={`flex flex-wrap gap-2 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
          {dayOptions.map(option => {
            const isSelected = formData.days_on.includes(option.value);
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => toggleDay(option.value)}
                className={`rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isSelected
                    ? "border border-blue-500 bg-blue-500 text-white"
                    : "border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition`}>
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Select the days the bot is active.
        </p>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded px-6 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting
              ? "cursor-not-allowed bg-gray-400"
              : isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {isSubmitting
            ? "Updating..."
            : isSuccess
              ? "Updated"
              : "Update Settings"}
        </button>
      </div>
    </form>
  );
}
