import { HTMLSelect } from "@blueprintjs/core";
import { useMemo, useState } from "react";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import { useChangeQualifyingPeriod } from "../../hooks/useChangeQualifyingPeriod";
import type { Profile } from "../../models/profile";

type PeriodSelectorProps = {
  profile: Profile;
};

export const PeriodSelector = ({ profile }: PeriodSelectorProps) => {
  const qualifyingPeriods = getAllValidQualifyingPeriods();
  const [selectedPeriod, setSelectedPeriod] = useState(profile.periode_start_month ?? 0);
  const changePeriod = useChangeQualifyingPeriod(profile.id, setSelectedPeriod);

  const periodOptions = useMemo(
    () => [
      { value: 0, label: "Select..." },
      ...qualifyingPeriods.map(period => ({
        value: period.month,
        label: period.label,
      })),
    ],
    [qualifyingPeriods]
  );

  return <HTMLSelect value={selectedPeriod} onChange={changePeriod} options={periodOptions} />;
};
