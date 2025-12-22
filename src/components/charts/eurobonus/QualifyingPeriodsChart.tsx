import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import type { Profile } from "../../../models/profile";
import type { QualifyingTransaction } from "../../../models/transaction";
import styles from "./QualifyingPeriodsChart.module.scss";
import { getAllValidQualifyingPeriods } from "../../../models/qualifying-periods";
import { SelectDropdown } from "../../shared/SelectDropdown";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

type QualifyingPeriodsChartProps = {
  transactions: QualifyingTransaction[];
  profiles: Profile[];
};

const periods = getAllValidQualifyingPeriods();

export const QualifyingPeriodsChart = ({ transactions, profiles }: QualifyingPeriodsChartProps) => {
  const [selectedProfile, setSelectedProfile] = useState(profiles.find(x => x.user_id)!);

  const profileTransactions = useMemo(
    () => transactions.filter(transaction => transaction.profile_id === selectedProfile.id),
    [transactions, selectedProfile]
  );
  const qualifyingPeriod = useMemo(() => periods.find(x => x.month === selectedProfile.periode_start_month) ?? periods[0], [selectedProfile]);

  const handleProfileSelect = (selectedProfile: Profile) => {
    setSelectedProfile(selectedProfile);
  };

  const data = useMemo(
    () => ({
      labels: profileTransactions.map(t => t.period),
      datasets: [
        {
          data: profileTransactions.map(t => t.value),
          backgroundColor: "rgba(255, 206, 86, 0.2)", // New color
          borderColor: "rgba(255, 206, 86, 1)", // New color
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
      annotation: {
        annotations: {
          line1: {
            type: "line" as const,
            yMin: 20000,
            yMax: 20000,
            borderColor: "rgba(150, 145, 134, 0.8)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
          line2: {
            type: "line" as const,
            yMin: 45000,
            yMax: 45000,
            borderColor: "rgba(214, 148, 6, 0.87)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
          line3: {
            type: "line" as const,
            yMin: 90000,
            yMax: 90000,
            borderColor: "rgba(0, 0, 0, 0.8)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
        },
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
        <div className={styles.dropdownContainer}>
          <SelectDropdown
            options={profiles}
            selectedOption={selectedProfile}
            onChange={handleProfileSelect}
            optionLabel={profile => profile.display_name ?? ""}
            placeholder="Select Profile"
          />
        </div>
      )}
      <div style={{ textAlign: "center" }}>Qualifying Period {qualifyingPeriod.label}</div>
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
