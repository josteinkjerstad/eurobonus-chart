import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getDisplayName, type Vendor, GroupVendor, groupedVendors } from "../models/vendor";
import type { VendorTransaction } from "../models/transaction";
import { OptionsDropdown } from "./OptionsDropdown";
import styles from "./VendorChart.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type VendorChartProps = {
  transactions: VendorTransaction[];
}

export const VendorChart = ({ transactions } : VendorChartProps) => {
  const [selectedVendors, setSelectedVendors] = useState<Set<Vendor>>(new Set(transactions.map(transaction => transaction.vendor)));
  const years = useMemo(() => Array.from(new Set(transactions.map(x => x.year))), [transactions]);
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set(years));
  const [groupedVendorsState, setGroupedVendorsState] = useState<Record<GroupVendor, boolean>>({
    [GroupVendor.EuroBonusEarnShop]: true,
    [GroupVendor.CarRental]: true,
    [GroupVendor.AirlinePartner]: true,
    [GroupVendor.NewspaperPartner]: true,
    [GroupVendor.HotelPartner]: true,
    [GroupVendor.CreditCardPartner]: false,
  });

  const vendorOptions = useMemo(() => 
    Array.from(new Set(transactions.map(transaction => transaction.vendor)))
      .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b))), 
    [transactions]
  );

  const groupOptions = (Object.keys(groupedVendors) as GroupVendor[])
    .sort((a, b) => a.localeCompare(b));

  const handleToggleGroupChange = (selectedOptions: Set<GroupVendor>) => {
    const newGroupedVendors = Object.keys(groupedVendorsState).reduce((acc, group) => {
      acc[group as GroupVendor] = selectedOptions.has(group as GroupVendor);
      return acc;
    }, {} as Record<GroupVendor, boolean>);
    setGroupedVendorsState(newGroupedVendors);
  };

  const filteredVendorPoints = useMemo(() => {
    const filteredTransactions = transactions
      .filter(transaction => selectedVendors.has(transaction.vendor) && selectedYears.has(transaction.year));

    const groupedTransactions = Object.entries(groupedVendorsState)
      .filter(([_, isGrouped]) => isGrouped)
      .map(([group]) => {
        const vendors = groupedVendors[group as GroupVendor];
        const points = filteredTransactions
          .filter(transaction => vendors.includes(transaction.vendor))
          .reduce((sum, transaction) => sum + transaction.value!, 0);
        return { vendor: group as GroupVendor, points };
      });

    const individualTransactions = Array.from(
      filteredTransactions
      .filter(transaction => !Object.entries(groupedVendorsState).some(([group, isGrouped]) => isGrouped && groupedVendors[group as GroupVendor].includes(transaction.vendor)))
      .reduce((map, transaction) => {
        const vendor = transaction.vendor;
        if (!map.has(vendor)) {
          map.set(vendor, { vendor, points: 0 });
        }
        map.get(vendor)!.points += transaction.value!;
        return map;
      }, new Map<Vendor, { vendor: Vendor; points: number }>())
      .values()
    );

    return [...groupedTransactions, ...individualTransactions]
      .filter(v => v.points > 0)
      .sort((a, b) => b.points - a.points);
  }, [transactions, selectedVendors, selectedYears, groupedVendorsState]);

  const data = {
    labels: filteredVendorPoints.map(v => getDisplayName(v.vendor)),
    datasets: [
      {
        data: filteredVendorPoints.map(v => v.points),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

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
          minRotation: 45,
          maxRotation: 45,
        }
      }
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.controls}>
        <OptionsDropdown 
          options={vendorOptions} 
          selectedOptions={selectedVendors} 
          onChange={setSelectedVendors} 
          optionLabel={getDisplayName} 
          placeholder="Select vendors..."
        />
        <OptionsDropdown 
          options={years} 
          selectedOptions={selectedYears} 
          onChange={setSelectedYears} 
          optionLabel={(year: number) => year.toString()} 
          placeholder="Select years..."
        />
        <OptionsDropdown 
          options={groupOptions} 
          selectedOptions={new Set(Object.keys(groupedVendorsState).filter(group => groupedVendorsState[group as GroupVendor]) as GroupVendor[])} 
          onChange={handleToggleGroupChange} 
          optionLabel={(group: GroupVendor) => group} 
          placeholder="Toggle grouping"
        />
      </div>
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};