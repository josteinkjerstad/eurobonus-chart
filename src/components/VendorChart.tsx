import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getDisplayName, GroupVendor, groupedVendors, type Vendor } from "../models/vendor";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VendorChartProps {
  vendorPoints: Record<Vendor, number>;
}

export const VendorChart: React.FC<VendorChartProps> = ({ vendorPoints }) => {
  const [grouping, setGrouping] = useState<Record<GroupVendor, boolean>>({
    [GroupVendor.CarRental]: true,
    [GroupVendor.EuroBonusEarnShop]: true,
    [GroupVendor.AirlinePartner]: true,
    [GroupVendor.CreditCardPartner]: false,
    [GroupVendor.NewspaperPartner]: true,
  });

  const handleGroupingChange = (group: GroupVendor) => {
    setGrouping(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getGroupedVendorPoints = () => {
    const groupedPoints: Record<string, number> = { ...vendorPoints };

    Object.entries(grouping).forEach(([group, isGrouped]) => {
      if (isGrouped) {
        const vendors = groupedVendors[group as GroupVendor];
        const totalPoints = vendors.reduce((acc, vendor) => acc + (vendorPoints[vendor] || 0), 0);
        vendors.forEach(vendor => delete groupedPoints[vendor]);
        groupedPoints[group] = totalPoints;
      }
    });

    return groupedPoints;
  };

  const sortedVendorPoints = Object.entries(getGroupedVendorPoints())
    .map(([vendor, points]) => ({ vendor, points }))
    .filter(x => x.points > 0)
    .sort((a, b) => b.points - a.points);

  const data = {
    labels: sortedVendorPoints.map(v => getDisplayName(v.vendor as Vendor)),
    datasets: [
      {
        label: "Points",
        data: sortedVendorPoints.map(v => v.points),
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
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div style={{ width: '100%', height: '400px' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <div style={{ marginBottom: '10px' }}>Group Vendors</div>
        {Object.values(GroupVendor).map(group => (
          <label key={group} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={grouping[group]}
              onChange={() => handleGroupingChange(group)}
            />
            {group}
          </label>
        ))}
      </div>
    </div>
  );
};