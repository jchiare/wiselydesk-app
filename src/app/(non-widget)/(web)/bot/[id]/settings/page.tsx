"use client";
import { BotSetting } from "@prisma/client";
import { useState, useEffect } from "react";

// Fetch bot settings (server-side)
async function fetchBotSettings(botId: string) {
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
  const [botSettings, setBotSettings] = useState<BotSetting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const botId = params.id;

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchBotSettings(botId);
        setBotSettings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [botId]);

  if (loading) return <div className="mt-8 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl rounded-md bg-white p-6 shadow-md">
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
      alert("Bot settings updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update bot settings");
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
            />
            <span className="self-center">:</span>
            <input
              type="number"
              name="widget_start_minute"
              value={formData.widget_start_minute}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={59}
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
            />
            <span className="self-center">:</span>
            <input
              type="number"
              name="widget_end_minute"
              value={formData.widget_end_minute}
              onChange={handleChange}
              className="w-16 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              min={0}
              max={59}
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
                className={`rounded px-4 py-2 ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
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
          className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500">
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
          className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500">
          <option value="widget_hours">Widget Hours</option>
          <option value="always">Always</option>
          <option value="never">Never</option>
        </select>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Update Settings
        </button>
      </div>
    </form>
  );
}
