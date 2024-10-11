import prisma from "@/lib/prisma"; 
import { BotSetting } from "@prisma/client"; 
import { useState, useEffect } from "react";

// Fetch bot settings (server-side)
async function fetchBotSettings(botId: string) {
  const res = await fetch(`/api/bot/${botId}/bot-settings/`);
  if (!res.ok) {
    throw new Error("Failed to fetch bot settings");
  }
  return res.json();
}

export default function BotSettingsPage({params}: {params: {id: string}}) {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {botSettings ? (
        <BotSettingsForm botSettings={botSettings} />
      ) : (
        <div>No settings found.</div>
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
    days_on: botSettings.days_on,
    time_zone: botSettings.time_zone,
    is_active: botSettings.is_active,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send updated data to API
    try {
      const res = await fetch(`/api/bot/${botSettings.bot_id}/bot-settings/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update bot settings");
      }
      alert("Bot settings updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update bot settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Start Time
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="widget_start_hour"
              value={formData.widget_start_hour}
              onChange={handleChange}
              className="w-16 p-2 border border-gray-300 rounded"
              min={0}
              max={23}
            />
            <input
              type="number"
              name="widget_start_minute"
              value={formData.widget_start_minute}
              onChange={handleChange}
              className="w-16 p-2 border border-gray-300 rounded"
              min={0}
              max={59}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget End Time
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="widget_end_hour"
              value={formData.widget_end_hour}
              onChange={handleChange}
              className="w-16 p-2 border border-gray-300 rounded"
              min={0}
              max={23}
            />
            <input
              type="number"
              name="widget_end_minute"
              value={formData.widget_end_minute}
              onChange={handleChange}
              className="w-16 p-2 border border-gray-300 rounded"
              min={0}
              max={59}
            />
          </div>
        </div>
      </div>

      {/* Days On */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Days Active</label>
        <input
          type="text"
          name="days_on"
          value={formData.days_on}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>

      {/* Time Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Time Zone</label>
        <input
          type="text"
          name="time_zone"
          value={formData.time_zone}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>

      {/* Is Active */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Is Active</label>
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        >
          <option value="widget_hours">Widget Hours</option>
          <option value="always">Always</option>
          <option value="never">Never</option>
        </select>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Settings
        </button>
      </div>
    </form>
  );
}
