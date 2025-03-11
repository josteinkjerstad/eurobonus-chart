import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { YearlyTransaction } from "../../models/transaction";
import styles from "./YearlySpentChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type YearlySpentChartProps = {
  yearlyPoints: YearlyTransaction[];
};

export const YearlySpentChart = ({ yearlyPoints }: YearlySpentChartProps) => {
  const data = {
    labels: yearlyPoints.map((point) => point.year.toString()),
    datasets: [
      {
        label: "Points Earned",
        data: yearlyPoints.map((point) => point.earned),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 100,
      },
      {
        label: "Points Spent",
        data: yearlyPoints.map((point) => point.spent),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        maxBarThickness: 100,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
          minRotation: 0,
          maxRotation: 45,
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};
