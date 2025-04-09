import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./PercentileChart.module.scss";
import { Colors } from "../../../styles/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type PercentileChartProps = {
  groupedSums: Record<string, number>;
};

export const PercentileChart = ({ groupedSums }: PercentileChartProps) => {
  const data = {
    labels: Object.keys(groupedSums),
    datasets: [
      {
        label: "Users",
        data: Object.values(groupedSums),
        backgroundColor: Colors.lightGreen,
        borderColor: Colors.greenBorder,
        borderWidth: 1,
        maxBarThickness: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        suggestedMax: Math.max(...Object.values(groupedSums)) + 1, // Dynamically adjust max value
      },
      x: {
        ticks: {
          autoSkip: false,
          minRotation: 45,
          maxRotation: 45,
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};
