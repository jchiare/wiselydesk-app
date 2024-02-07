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

export default function ConversationCountChart({
  frequency,
  viewingType,
  conversationCounts
}: {
  frequency: FrequencyType;
  viewingType?: ViewingType;
  conversationCounts: any;
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
        },
        stacked: true
      },
      x: {
        stacked: true
      }
    }
  };

  const dates =
    (conversationCounts && conversationCounts.map((x: any) => x.date)) || [];
  const counts =
    (conversationCounts &&
      conversationCounts.map((x: any) => x.total_convo_count)) ||
    [];

  const deflectedCounts =
    (conversationCounts &&
      conversationCounts.map((x: any) => x.deflected_convo_count)) ||
    [];

  const ticketCreationcounts =
    (conversationCounts &&
      conversationCounts.map((x: any) => x.ticket_created_count)) ||
    [];
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Total",
        data: counts,
        backgroundColor: "rgb(31,41,55)"
      },
      {
        label: "Deflected",
        data: deflectedCounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      },
      {
        label: "Tickets Created",
        data: ticketCreationcounts,
        backgroundColor: "rgb(240,230,140)"
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
