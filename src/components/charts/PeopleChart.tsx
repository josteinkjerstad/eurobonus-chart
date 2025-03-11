import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import type { PeopleTransaction, Transaction } from "../../models/transaction";
import type { Profile } from "../../models/profile";
import styles from "./PeopleChart.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type PeopleChartProps = {
  transactions: PeopleTransaction[];
  profiles: Profile[];
};

export const PeopleChart = ({ transactions, profiles }: PeopleChartProps) => {
  const data = {
    labels: transactions.map(transaction => profiles.find(profile => profile.id === transaction.profile_id)?.display_name),
    datasets: [
      {
        label: "Points Earned",
        data: transactions.map(transaction => transaction.value),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
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
