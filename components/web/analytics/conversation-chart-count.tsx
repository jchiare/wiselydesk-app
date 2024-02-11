"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import type { FrequencyType, ViewingType } from "@/components/web/analytics";
import type { ConversationAnalyticsData } from "@/lib/web/analytics";

export default function ConversationCountChart({
  frequency,
  viewingType,
  conversationCounts
}: {
  frequency: FrequencyType;
  viewingType?: ViewingType;
  conversationCounts: ConversationAnalyticsData[];
}) {
  const title = `${
    frequency.charAt(0).toUpperCase() + frequency.slice(1)
  } Conversations`;
  const separateOptions: ChartOptions<"bar"> = {
    responsive: true,
    elements: {
      bar: {
        borderRadius: 4
      }
    },
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: "bottom" as const
      },
      title: {
        color: "black",
        display: true,
        text: title,
        padding: 15,
        font: { size: 24 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const stackedOptions: ChartOptions<"bar"> = {
    responsive: true,
    elements: {
      bar: {
        borderRadius: 4
      }
    },
    layout: {
      padding: 20
    },
    interaction: {
      intersect: false,
      mode: "index"
    },
    plugins: {
      legend: {
        position: "bottom" as const
      },
      title: {
        color: "black",
        display: true,
        text: title,
        padding: 15,
        font: { size: 24 }
      },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.parsed.y !== 0,
        callbacks: {
          footer: (tooltipItems) => {
            let sum = 0;
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              tooltipItems[0].chart.data.datasets.forEach((dataset) => {
                sum += dataset.data[index] as number;
              });
            }
            return "Total: " + sum;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        stacked: true
      },
      x: {
        stacked: true
      }
    }
  };

  const dates =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) => conversation.date
    ) || [];
  const counts =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) =>
        conversation.total_convo_count
    ) || [];

  const deflectedCounts =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) =>
        conversation.deflected_convo_count
    ) || [];

  const ticketCreationcounts =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) =>
        conversation.ticket_created_count
    ) || [];

  const negativeChatCounts =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) => conversation.negative_count
    ) || [];

  const positiveChatCounts =
    conversationCounts?.map(
      (conversation: ConversationAnalyticsData) => conversation.positive_count
    ) || [];

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Unactioned chats",
        data: counts,
        backgroundColor: "rgb(31,41,55)"
      },
      {
        label: "Deflected",
        data: deflectedCounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      },
      {
        label: "Tickets created",
        data: ticketCreationcounts,
        backgroundColor: "rgb(240,230,140)"
      },
      {
        label: "Negative chats",
        data: negativeChatCounts,
        backgroundColor: "rgb(255,99,71)"
      },
      {
        label: "Positive chats",
        data: positiveChatCounts,
        backgroundColor: "rgb(144,238,144)"
      }
    ]
  };

  return (
    <Bar
      options={viewingType === "stacked" ? stackedOptions : separateOptions}
      data={chartData}
    />
  );
}
