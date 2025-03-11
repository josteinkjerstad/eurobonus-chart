import { useMemo, useState } from "react";
import { Label, InputGroup, Switch, HTMLSelect, H4 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import styles from "./ProfileSettings.module.scss";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useChangeQualifyingPeriod } from "../../hooks/useChangeQualifyingPeriod";
import { useChangeIsPublic } from "../../hooks/useChangeIsPublic";

type ProfileSettingsProps = {
  profile: Profile;
};

export const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [qualifyingPeriod, setQualifyingPeriod] = useState(profile.periode_start_month);
  const qualifyingPeriods = getAllValidQualifyingPeriods();

  const changeIsPublic = useChangeIsPublic(setIsPublic);
  const changeDisplayName = useChangeDisplayName(profile.id, setDisplayName);
  const changeQualifyingPeriod = useChangeQualifyingPeriod(profile.id, setQualifyingPeriod);

  const periodOptions = useMemo(
    () => [
      { value: 0, label: "Select a period" },
      ...qualifyingPeriods.map(period => ({
        value: period.month,
        label: period.label,
      })),
    ],
    [qualifyingPeriods]
  );

  return (
    <div className={styles.container}>
      <H4>Profile Settings</H4>
      <Label>
        Display Name
        <InputGroup onChange={e => setDisplayName(e.target.value)} value={displayName} onBlur={changeDisplayName} />
      </Label>
      <Label>
        Qualifying Period
        <HTMLSelect value={qualifyingPeriod as number} onChange={changeQualifyingPeriod} options={periodOptions} />
      </Label>
      <Switch label="Public profile" checked={isPublic} onChange={changeIsPublic} />
    </div>
  );
};
