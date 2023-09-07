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
  if (frequency === "weekly") {
    return dates.map((date) => {
      const weekNum = date.slice(0, 2);
      return weekStartDates[weekNum];
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
  const chartData = {
    labels: formattedDates(frequency, dates),
    datasets: [
      {
        label: "count",
        data: counts,
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  };

  if (!conversationCounts) {
    return (
      <svg
        className="mr-3 h-5 w-5 animate-spin text-blue-500"
        viewBox="0 0 24 24">
        <circle
          className="opacity-0"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="grey"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  }

  return <Bar options={options} data={chartData} />;
}
