import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getDisplayName, type Vendor, GroupVendor, groupedVendors } from "../models/vendor";
import type { VendorTransaction } from "../models/transaction";
import { OptionsDropdown } from "./OptionsDropdown";
import { ToggleGroup } from "./ToggleGroup";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type VendorChartProps = {
  transactions: VendorTransaction[];
}

export const VendorChart = ({ transactions } : VendorChartProps) => {
  const [selectedVendors, setSelectedVendors] = useState<Set<Vendor>>(new Set(transactions.map(transaction => transaction.vendor)));
  const years = useMemo(() => Array.from(new Set(transactions.map(x => x.year))), [transactions]);
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set(years));
  const [groupedVendorsState, setGroupedVendorsState] = useState<Record<GroupVendor, boolean>>({
    [GroupVendor.CarRental]: false,
    [GroupVendor.EuroBonusEarnShop]: false,
    [GroupVendor.AirlinePartner]: false,
    [GroupVendor.CreditCardPartner]: false,
    [GroupVendor.NewspaperPartner]: false,
  });

  const filteredVendorPoints = useMemo(() => {
    const filteredTransactions = transactions
      .filter(transaction => selectedVendors.has(transaction.vendor) && selectedYears.has(transaction.year));

    const groupedTransactions = Object.entries(groupedVendorsState)
      .filter(([group, isGrouped]) => isGrouped)
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
      .sort((a, b) => b.points - a.points);
  }, [transactions, selectedVendors, selectedYears, groupedVendorsState]);

  const data = {
    labels: filteredVendorPoints.map(v => getDisplayName(v.vendor)),
    datasets: [
      {
        label: "Points",
        data: filteredVendorPoints.map(v => v.points),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        }
      }
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <OptionsDropdown 
            options={Array.from(new Set(transactions.map(transaction => transaction.vendor)))} 
            selectedOptions={selectedVendors} 
            onChange={setSelectedVendors} 
            optionLabel={getDisplayName} 
            placeholder="Select vendors..."
          />
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <OptionsDropdown 
            options={years} 
            selectedOptions={selectedYears} 
            onChange={setSelectedYears} 
            optionLabel={(year: number) => year.toString()} 
            placeholder="Select years..."
          />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
          <ToggleGroup 
            groupedVendors={groupedVendorsState} 
            setGroupedVendors={setGroupedVendorsState} 
          />
        </div>
      </div>
    </div>
  );
};