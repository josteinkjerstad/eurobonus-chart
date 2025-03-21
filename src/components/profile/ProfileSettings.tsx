import { useState } from "react";
import { Label, InputGroup, Switch, Card, H5 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import styles from "./ProfileSettings.module.scss";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useChangeIsPublic } from "../../hooks/useChangeIsPublic";
import { PeriodSelector } from "../shared/PeriodPeriodSelector";
import { ViatrumfUpload } from "./ViatrumfUpload";

type ProfileSettingsProps = {
  profile: Profile;
  onUpdateDisplayName: (id: string, newDisplayName: string) => void;
};

export const ProfileSettings = ({ profile, onUpdateDisplayName }: ProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);

  const changeIsPublic = useChangeIsPublic(setIsPublic);
  const changeDisplayName = useChangeDisplayName(profile.id, newName => {
    setDisplayName(newName);
    onUpdateDisplayName(profile.id, newName);
  });

  return (
    <Card>
      <div className={styles.container}>
        <H5>Profile Settings</H5>
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
    </Card>
  );
};
