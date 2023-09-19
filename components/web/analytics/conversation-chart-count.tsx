"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

function formattedDates(
  frequency: "daily" | "weekly" | "monthly",
  dates: Array<string>
) {
  const weekStartDates: { [key: string]: string } = {
    "52": "25-12-2023",
    "51": "18-12-2023",
    "50": "11-12-2023",
    "49": "04-12-2023",
    "48": "27-11-2023",
    "47": "20-11-2023",
    "46": "13-11-2023",
    "45": "06-11-2023",
    "44": "30-10-2023",
    "43": "23-10-2023",
    "42": "16-10-2023",
    "41": "09-10-2023",
    "40": "02-10-2023",
    "39": "25-09-2023",
    "38": "18-09-2023",
    "37": "11-09-2023",
    "36": "04-09-2023",
    "35": "28-08-2023",
    "34": "21-08-2023",
    "33": "14-08-2023",
    "32": "07-08-2023",
    "31": "31-07-2023",
    "30": "24-07-2023",
    "29": "17-07-2023",
    "28": "10-07-2023",
    "27": "03-07-2023"
  };

  const monthNames: { [key: string]: string } = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };
  if (frequency === "weekly") {
    return dates.map((date) => {
      const weekNum = date.slice(0, 2);
      return weekStartDates[weekNum];
    });
  } else if (frequency === "monthly") {
    return dates.map((date) => {
      const monthNum = date.slice(0, 2);
      return monthNames[monthNum];
    });
  } else {
    return dates;
  }
}

export default function ConversationCountChart({
  frequency,
  conversationCounts
}: {
  frequency: "daily" | "weekly" | "monthly";
  conversationCounts: any;
}) {
  const title = `${frequency} conversation counts`;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: title
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
  const chartData = {
    labels: formattedDates(frequency, dates),
    datasets: [
      {
        label: "Total Conversations",
        data: counts,
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      },
      {
        label: "Deflected Conversations",
        data: deflectedCounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      }
    ]
  };

  return <Bar options={options} data={chartData} />;
}
