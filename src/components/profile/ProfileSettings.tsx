import { useMemo, useState } from "react";
import { Label, InputGroup, Switch, H4 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import styles from "./ProfileSettings.module.scss";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useChangeIsPublic } from "../../hooks/useChangeIsPublic";
import { PeriodSelector } from "../shared/PeriodPeriodSelector";
type ProfileSettingsProps = {
  profile: Profile;
};

export const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);

  const changeIsPublic = useChangeIsPublic(setIsPublic);
  const changeDisplayName = useChangeDisplayName(profile.id, setDisplayName);

  return (
    <div className={styles.container}>
      <H4>Profile Settings</H4>
      <Label>
        Display Name
        <InputGroup onChange={e => setDisplayName(e.target.value)} value={displayName} onBlur={changeDisplayName} />
      </Label>
      <Label>
        Qualifying Period
        <PeriodSelector profile={profile} />
      </Label>
      <Switch label="Public profile" checked={isPublic} onChange={changeIsPublic} />
    </div>
  );
};
