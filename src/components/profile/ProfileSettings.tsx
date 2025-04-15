import { useState } from "react";
import { Label, InputGroup, Card, H5 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import styles from "./ProfileSettings.module.scss";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useChangeIsPublic } from "../../hooks/useChangeIsPublic";
import { PeriodSelector } from "../shared/PeriodPeriodSelector";
import { IconButton, Switch } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";

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

  const copyProfileUrl = () => {
    const profileUrl = `${window.location.origin}/user?id=${profile.user_id}`;
    navigator.clipboard.writeText(profileUrl);
  };

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
        <Label>
          Public Profile
          <div style={{ display: "flex", alignItems: "center" }}>
            <Switch size="small" title="Public profile" checked={isPublic} onChange={changeIsPublic} />
            {isPublic && (
              <IconButton size="small" onClick={copyProfileUrl} title="Copy URL">
                <ContentCopy fontSize="small" />
              </IconButton>
            )}
          </div>
        </Label>
      </div>
    </Card>
  );
};
