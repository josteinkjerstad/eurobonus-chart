import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import type { QualifyingTransaction } from "../../models/transaction";
import type { Profile } from "../../models/profile";
import styles from "./QualifyingPeriodsChart.module.scss";
import { useMemo, useState } from "react";
import { HTMLSelect } from "@blueprintjs/core";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type QualifyingPeriodsChartProps = {
  transactions: QualifyingTransaction[];
  profiles: Profile[];
};

export const QualifyingPeriodsChart = ({ transactions, profiles }: QualifyingPeriodsChartProps) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile>(profiles.find(p => p.user_id)!);

  const profileTransactions = useMemo(
    () => transactions.filter(transaction => transaction.profile_id === selectedProfile.id),
    [transactions, selectedProfile]
  );

  const profileOptions = useMemo(
    () =>
      [profiles.find(p => p.user_id), ...profiles.filter(p => p.parent_id)].map(profile => ({
        value: profile!.id,
        label: profile!.display_name,
      })),
    [profiles]
  );

  const handleProfileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const profile = profiles.find(p => p.id === event.target.value);
    setSelectedProfile(profile!);
  };

  const data = useMemo(
    () => ({
      labels: profileTransactions.map(t => t.period),
      datasets: [
        {
          data: profileTransactions.map(t => t.value),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          maxBarThickness: 100,
        },
      ],
    }),
    [profileTransactions]
  );

  const options = {
    plugins: {
      legend: {
        display: false,
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
      {profiles.length > 1 && (
        <div className={styles.controls}>
          <HTMLSelect
            onChange={handleProfileSelect}
            value={selectedProfile.id}
            options={profileOptions}
            style={{ marginBottom: "10px", minWidth: "200px" }}
          />
        </div>
      )}
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
