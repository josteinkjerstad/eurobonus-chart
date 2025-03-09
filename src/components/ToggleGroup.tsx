import React from "react";
import { GroupVendor } from "../models/vendor";

interface ToggleGroupProps {
  groupedVendors: Record<GroupVendor, boolean>;
  setGroupedVendors: React.Dispatch<React.SetStateAction<Record<GroupVendor, boolean>>>;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ groupedVendors, setGroupedVendors }) => {
  const handleToggle = (group: GroupVendor) => {
    setGroupedVendors(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {Object.keys(groupedVendors).map(group => (
        <label key={group} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={groupedVendors[group as GroupVendor]}
            onChange={() => handleToggle(group as GroupVendor)}
          />
          {group}
        </label>
      ))}
    </div>
  );
};
