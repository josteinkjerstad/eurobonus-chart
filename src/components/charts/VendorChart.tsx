import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getDisplayName, type Vendor, GroupVendor, groupedVendors } from "../../models/vendor";
import type { VendorTransaction } from "../../models/transaction";
import styles from "./VendorChart.module.scss";
import { OptionsDropdown } from "../shared/OptionsDropdown";
import type { Profile } from "../../models/profile";
import { Partner } from "../../models/partners";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type VendorChartProps = {
  transactions: VendorTransaction[];
  profiles: Profile[];
};

export const VendorChart = ({ transactions, profiles }: VendorChartProps) => {
  const [selectedVendors, setSelectedVendors] = useState<Set<Vendor>>(new Set(transactions.map(transaction => transaction.vendor)));
  const years = useMemo(() => Array.from(new Set(transactions.map(x => x.year))).sort((a, b) => a - b), [transactions]);

  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set(years));

  const [groupedVendorsState, setGroupedVendorsState] = useState<Record<GroupVendor, boolean>>(
    Object.values(GroupVendor).reduce((acc, group) => {
      acc[group as GroupVendor] = true;
      return acc;
    }, {} as Record<GroupVendor, boolean>)
  );

  const [selectedMembers, setSelectedMembers] = useState<Set<Profile>>(new Set(profiles));

  const vendorOptions = useMemo(
    () => Array.from(new Set(transactions.map(transaction => transaction.vendor))).sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b))),
    [transactions]
  );

  const groupOptions = (Object.keys(groupedVendors) as GroupVendor[])
    .filter(group => groupedVendors[group].some(vendor => vendorOptions.includes(vendor)))
    .sort((a, b) => a.localeCompare(b));

  const [selectedGroups, setSelectedGroups] = useState<Set<GroupVendor>>(new Set(groupOptions));

  const handleToggleGroupChange = (selectedOptions: Set<GroupVendor>) => {
    const newGroupedVendors = Object.keys(groupedVendorsState).reduce((acc, group) => {
      acc[group as GroupVendor] = selectedOptions.has(group as GroupVendor);
      return acc;
    }, {} as Record<GroupVendor, boolean>);
    setGroupedVendorsState(newGroupedVendors);
  };

  const handleSelectedGroupsChange = (selectedOptions: Set<GroupVendor>) => {
    const vendorsInGroup = Array.from(selectedOptions)
      .reduce((acc, group) => {
        return acc.concat(groupedVendors[group]);
      }, [] as Vendor[])
      .concat(Partner.Unknown)
      .filter(vendor => vendorOptions.includes(vendor));

    setSelectedVendors(new Set(vendorsInGroup));
    setSelectedGroups(selectedOptions);
  };

  const handleAllVendorsSelected = () => {
    setSelectedVendors(new Set(vendorOptions));
    setSelectedGroups(new Set(groupOptions));
  };

  const filteredVendorPoints = useMemo(() => {
    const filteredTransactions = transactions.filter(
      transaction =>
        selectedVendors.has(transaction.vendor) &&
        selectedYears.has(transaction.year) &&
        Array.from(selectedMembers).some(member => member.id === transaction.profile_id)
    );

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
        .filter(
          transaction =>
            !Object.entries(groupedVendorsState).some(
              ([group, isGrouped]) => isGrouped && groupedVendors[group as GroupVendor].includes(transaction.vendor)
            )
        )
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

    return [...groupedTransactions, ...individualTransactions].filter(v => v.points > 0).sort((a, b) => b.points - a.points);
  }, [transactions, selectedVendors, selectedYears, groupedVendorsState, selectedMembers]);

  const handleBarClick = (elements: any) => {
    if (elements.length > 0) {
      const clickedVendor = filteredVendorPoints[elements[0].index].vendor;

      if (Object.values(GroupVendor).includes(clickedVendor as GroupVendor)) {
        const group = clickedVendor as GroupVendor;

        setGroupedVendorsState(prevState => ({
          ...prevState,
          [group]: false,
        }));

        handleSelectedGroupsChange(new Set([group]));
      }
    }
  };

  const data = {
    labels: filteredVendorPoints.map(v => getDisplayName(v.vendor)),
    datasets: [
      {
        data: filteredVendorPoints.map(v => v.points),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Prevent chart shaking by maintaining aspect ratio
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
    onClick: (_: unknown, elements: Array<{ index: number }>) => handleBarClick(elements), // Add click handler
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.controls}>
        <OptionsDropdown
          options={vendorOptions}
          selectedOptions={selectedVendors}
          onChange={setSelectedVendors}
          optionLabel={getDisplayName}
          onSelectAll={handleAllVendorsSelected}
          placeholder={`${selectedVendors.size} / ${vendorOptions.length} Vendors`}
        />
        <OptionsDropdown
          options={years}
          selectedOptions={selectedYears}
          onChange={setSelectedYears}
          optionLabel={(year: number) => year.toString()}
          placeholder={`${selectedYears.size} / ${years.length} Years`}
        />
        {profiles.length > 1 && (
          <OptionsDropdown
            options={profiles}
            selectedOptions={selectedMembers}
            onChange={setSelectedMembers}
            optionLabel={(member: Profile) => member.display_name ?? member.id}
            placeholder={`${selectedMembers.size} / ${profiles.length} Members`}
          />
        )}
        <OptionsDropdown
          options={groupOptions}
          selectedOptions={selectedGroups}
          onChange={handleSelectedGroupsChange}
          onSelectAll={handleAllVendorsSelected}
          optionLabel={(member: GroupVendor) => member}
          placeholder={`${selectedGroups.size} / ${groupOptions.length} Groups`}
        />
        <OptionsDropdown
          options={groupOptions}
          selectedOptions={new Set(Object.keys(groupedVendorsState).filter(group => groupedVendorsState[group as GroupVendor]) as GroupVendor[])}
          onChange={handleToggleGroupChange}
          optionLabel={(group: GroupVendor) => group}
          placeholder="Toggle Grouping"
        />
      </div>
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
