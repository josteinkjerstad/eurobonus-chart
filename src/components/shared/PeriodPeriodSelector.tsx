import { HTMLSelect } from "@blueprintjs/core";
import { useMemo, useState } from "react";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import { useChangeQualifyingPeriod } from "../../hooks/useChangeQualifyingPeriod";
import type { Profile } from "../../models/profile";
import { SelectDropdown } from "./SelectDropdown";

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

  return (
    <div style={{ width: 300 }}>
      <SelectDropdown
        options={periodOptions}
        selectedOption={periodOptions.find(x => x.value == selectedPeriod) ?? periodOptions[0]}
        onChange={option => {
          changePeriod(option?.value);
        }}
        optionLabel={x => x!.label}
      />
    </div>
  );
};
