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

import type { FrequencyType } from "@/components/web/analytics";
import type { ConversationAnalyticsData } from "@/lib/web/analytics";

export default function ConversationCountChart({
  frequency,
  conversationCounts
}: {
  frequency: FrequencyType;
  conversationCounts: ConversationAnalyticsData[];
}) {
  const title = `${
    frequency.charAt(0).toUpperCase() + frequency.slice(1)
  } Conversations`;

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
        filter: tooltipItem => tooltipItem.parsed.y !== 0,
        callbacks: {
          footer: tooltipItems => {
            let sum = 0;
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              tooltipItems[0].chart.data.datasets.forEach(dataset => {
                sum += dataset.data[index] as number;
              });
            }
            return "Total chats: " + sum;
          },
          label: context => {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            const total = totals[context.dataIndex];
            const percentage = ((value / total) * 100).toFixed(0) + "%";
            return `${label}: ${value} (${percentage})`;
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

  const totals = conversationCounts.map(
    conversation => conversation.total_convo_count
  );

  const chartData = {
    labels: conversationCounts.map(conversation => conversation.date),
    datasets: [
      {
        label: "Normal",
        data: conversationCounts.map(
          conversation =>
            conversation.total_convo_count -
            conversation.ticket_created_count -
            conversation.negative_count -
            conversation.positive_count
        ),
        backgroundColor: "rgb(31,41,55)"
      },
      {
        label: "Escalated",
        data: conversationCounts.map(
          conversation => conversation.ticket_created_count
        ),
        backgroundColor: "rgb(240,230,140)"
      },
      {
        label: "Negative",
        data: conversationCounts.map(
          conversation => conversation.negative_count
        ),
        backgroundColor: "rgb(255,99,71)"
      },
      {
        label: "Positive",
        data: conversationCounts.map(
          conversation => conversation.positive_count
        ),
        backgroundColor: "rgb(144,238,144)"
      }
    ]
  };

  return <Bar options={stackedOptions} data={chartData} />;
}
