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

  const totals = escalations.map(escalation => escalation.count);
  const uniqueReasons = new Set(
    escalations.map(escalation => escalation.reason)
  );
  const uniqueDates = new Set(escalations.map(escalation => escalation.date));

  let datasets: { label: string; data: number[]; backgroundColor: string }[] =
    [];
  //   for (const reason of uniqueReasons) {
  //     const escalationsForReason = escalations.filter(
  //       escalation => escalation.reason === reason
  //     );

  //     console.log("escalationsForReason len: ", escalationsForReason.length);

  //     const dataObject = {
  //       label: reason,
  //       data: escalationsForReason.map(escalation => escalation.count > 0 ?? 0),
  //       backgroundColor: getBackgroundColor(reason)
  //     };

  //     datasets.push(dataObject);
  //   }

  for (const date of uniqueDates) {
    const escalationsForDate = escalations.filter(
      escalation => escalation.date === date
    );

    for (const reason of uniqueReasons) {
      const specificEscalation = escalationsForDate.find(
        escalation => escalation.reason === reason
      );

      if (specificEscalation === undefined) {
        const foundEscalation = datasets.find(data => data.label === reason);
        if (foundEscalation) {
          foundEscalation.data.push(0);
        } else {
          datasets.push({
            label: reason,
            data: [0],
            backgroundColor: getBackgroundColor(reason)
          });
        }
      }
    }

    for (const specificEscalation of escalationsForDate) {
      console.log("specificEscalation: ", specificEscalation);
      if (
        datasets.find(data => data.label === specificEscalation.reason) ===
        undefined
      ) {
        datasets.push({
          label: specificEscalation.reason,
          data: [specificEscalation.count ?? 0],
          backgroundColor: getBackgroundColor(specificEscalation.reason)
        });
      } else {
        datasets
          .find(data => data.label === specificEscalation.reason)
          ?.data.push(specificEscalation.count ?? 0);
      }
    }
  }

  console.log("datasets: ", datasets);

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
