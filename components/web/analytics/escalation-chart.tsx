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
import type { EscalationAnalyticsData } from "@/lib/web/analytics";

export default function EscalationChart({
  frequency,
  escalations
}: {
  frequency: FrequencyType;
  escalations: EscalationAnalyticsData[];
}) {
  const title = `${
    frequency.charAt(0).toUpperCase() + frequency.slice(1)
  } Escalations`;

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
            return "Total escalations: " + sum;
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

  const uniqueReasons = Array.from(
    new Set(escalations.map(escalation => escalation.reason))
  );
  const uniqueDates = Array.from(
    new Set(escalations.map(escalation => escalation.date))
  );

  let datasets = uniqueReasons.map(reason => ({
    label: reason,
    data: new Array(uniqueDates.length).fill(0),
    backgroundColor: getBackgroundColor(reason)
  }));

  for (const escalation of escalations) {
    const dateIndex = uniqueDates.indexOf(escalation.date);
    const dataset = datasets.find(d => d.label === escalation.reason);
    if (dataset && dateIndex !== -1) {
      dataset.data[dateIndex] = escalation.count;
    }
  }

  const chartData = {
    labels: [...uniqueDates],
    datasets
  };

  return <Bar options={stackedOptions} data={chartData} />;
}

function getBackgroundColor(reason: string): string {
  const colorMap: Record<string, string> = {
    AI_could_not_solve: "rgb(255,99,71)",
    other: "rgb(240,230,140)",
    no_reason_given: "rgb(31,41,55)",
    missing_information: "rgb(144,238,144)"
  };

  return colorMap[reason] || "rgb(255,255,255)";
}
