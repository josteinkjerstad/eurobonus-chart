import { HTMLSelect } from "@blueprintjs/core";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import type { Profile } from "../../../models/profile";
import type { QualifyingTransaction } from "../../../models/transaction";
import styles from "./QualifyingPeriodsChart.module.scss";
import { getAllValidQualifyingPeriods } from "../../../models/qualifying-periods";
import { SelectDropdown } from "../../shared/SelectDropdown";
import { Colors } from "../../../styles/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const profileOptions = useMemo(
    () =>
      [profiles.find(p => p.user_id), ...profiles.filter(p => p.parent_id)].map(profile => ({
        value: profile!,
        label: profile!.display_name,
      })),
    [profiles]
  );

  const data = useMemo(
    () => ({
      labels: profileTransactions.map(t => t.period),
      datasets: [
        {
          data: profileTransactions.map(t => t.value),
          backgroundColor: Colors.yellow,
          borderColor: Colors.yellowBorder,
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
