import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import type { YearlyTransaction } from "../../../models/transaction";
import styles from "./YearlySpentChart.module.scss";
import { CalculateCurrentYearEstimatedPoints } from "../../../utils/calculations";
import { Colors } from "../../../styles/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type YearlySpentChartProps = {
  yearlyPoints: YearlyTransaction[];
};

export const YearlySpentChart = ({ yearlyPoints }: YearlySpentChartProps) => {
  const hasSpentData = yearlyPoints.some(point => point.spent > 0);
  const estimatedPointsForYear = CalculateCurrentYearEstimatedPoints(yearlyPoints);

  const data = {
    labels: yearlyPoints.map(point => point.year.toString()),
    datasets: [
      {
        label: "Points Earned",
        data: yearlyPoints.map(point => point.earned),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 100,
      },
      {
        label: "Estimated Points Earned",
        data: yearlyPoints.map(point => (point.year === new Date().getFullYear() ? estimatedPointsForYear : 0)),
        backgroundColor: Colors.yellow,
        borderColor: Colors.yellowBorder,
        borderWidth: 1,
        maxBarThickness: 100,
        hidden: true,
      },
      ...(hasSpentData
        ? [
            {
              label: "Points Spent",
              data: yearlyPoints.map(point => point.spent),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              maxBarThickness: 100,
            },
          ]
        : []),
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
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
  };

  return (
    <div className={styles.chart}>
      <Bar data={data} options={options} />
    </div>
  );
};
