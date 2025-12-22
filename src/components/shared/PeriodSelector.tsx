import { useMemo, useState } from "react";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import { useChangeQualifyingPeriod } from "../../hooks/useChangeQualifyingPeriod";
import type { Profile } from "../../models/profile";
import { Select, MenuItem, FormControl, InputLabel, type SelectChangeEvent, Grid } from "@mui/material";

type PeriodSelectorProps = {
  profile: Profile;
};

export const PeriodSelector = ({ profile }: PeriodSelectorProps) => {
  const qualifyingPeriods = getAllValidQualifyingPeriods();
  const [selectedPeriod, setSelectedPeriod] = useState(profile.periode_start_month ?? 0);
  const changePeriod = useChangeQualifyingPeriod(profile.id, setSelectedPeriod);

  const periodOptions = useMemo(
    () =>
      qualifyingPeriods.map(period => ({
        value: period.month,
        label: period.label,
      })),
    [qualifyingPeriods]
  );

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    changePeriod(value);
  };

  return (
    <Select fullWidth value={selectedPeriod} onChange={handleChange}>
      {periodOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};
