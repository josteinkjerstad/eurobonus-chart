import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./ViatrumfVendorChart.module.scss";
import { OptionsDropdown } from "../shared/OptionsDropdown";
import { SelectDropdown } from "../shared/SelectDropdown"; // Add import for SelectDropdown
import type { ViatrumfVendorTransaction } from "../../models/transaction";
import { Status } from "../../enums/status";
import type { Profile } from "../../models/profile";
import { TrumfCurrency } from "../../enums/trumfCurrency";
import { getTrumfValue } from "../../utils/viatrumf-calculations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ViatrumfChartProps = {
  transactions: ViatrumfVendorTransaction[];
  profiles: Profile[];
};

export const ViatrumfVendorChart = ({ transactions, profiles }: ViatrumfChartProps) => {
  const years = useMemo(() => Array.from(new Set(transactions.map(x => x.year))).sort((a, b) => a - b), [transactions]);
  const status = useMemo(() => Object.values(Status), []);
  const stores = useMemo(() => Array.from(new Set(transactions.map(t => t.vendor))), [transactions]);
  const pointDisplayOptions = useMemo(() => Object.values(TrumfCurrency), []);
  const members = useMemo(() => profiles.filter(x => transactions.some(t => x.id == t.profile_id)), [profiles, transactions]);

  const [selectedPointDisplay, setSelectedPointDisplay] = useState(TrumfCurrency.Sas13_5);
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set(years));
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set(stores));
  const [selectedStatus, setSelectedStatus] = useState<Set<Status>>(new Set(status.filter(s => s === Status.Transferred)));
  const [selectedMembers, setSelectedMembers] = useState<Set<Profile>>(new Set(members));

  const groupedTransactions = useMemo(
    () =>
      Object.entries(
        transactions
          .filter(
            x => selectedYears.has(x.year) && selectedStatus.has(x.status) && Array.from(selectedMembers).some(member => member.id === x.profile_id)
          )
          .reduce((acc, t) => {
            acc[t.vendor] = (acc[t.vendor] || 0) + getTrumfValue(t.value, selectedPointDisplay);
            return acc;
          }, {} as Record<string, number>)
      )
        .map(([vendor, value]) => ({ vendor, value }))
        .sort((a, b) => b.value - a.value),
    [transactions, selectedYears, selectedStatus, selectedMembers, selectedPointDisplay]
  );

  const data = {
    labels: groupedTransactions.map(t => t.vendor),
    datasets: [
      {
        label: `${selectedPointDisplay}`,
        data: groupedTransactions.map(t => t.value),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
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
      <div className={styles.controls}>
        <OptionsDropdown
          options={stores}
          selectedOptions={selectedStores}
          onChange={setSelectedStores}
          optionLabel={store => store}
          placeholder={`${selectedStores.size} / ${stores.length} Stores`}
        />
        <OptionsDropdown
          options={years}
          selectedOptions={selectedYears}
          onChange={setSelectedYears}
          optionLabel={(year: number) => year.toString()}
          placeholder={`${selectedYears.size} / ${years.length} Years`}
        />
        {members.length > 1 && (
          <OptionsDropdown
            options={members}
            selectedOptions={selectedMembers}
            onChange={setSelectedMembers}
            optionLabel={(member: Profile) => member.display_name ?? member.id}
            placeholder={`${selectedMembers.size} / ${profiles.length} Members`}
          />
        )}
        <OptionsDropdown
          options={status}
          selectedOptions={selectedStatus}
          onChange={setSelectedStatus}
          optionLabel={status => status}
          placeholder={`${selectedStatus.size} / ${status.length} Statuses`}
        />
        <SelectDropdown
          options={pointDisplayOptions}
          selectedOption={selectedPointDisplay}
          onChange={setSelectedPointDisplay}
          optionLabel={option => option}
          placeholder="Select Points Display"
        />
      </div>
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
