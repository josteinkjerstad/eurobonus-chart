import { useState } from "react";
import type { Profile } from "../../../models/profile";
import { useChangeDisplayName } from "../../../hooks/useChangeDisplayName";
import { useChangeIsPublic } from "../../../hooks/useChangeIsPublic";
import { PeriodSelector } from "../../shared/PeriodSelector";
import { Divider, Grid, IconButton, InputLabel, Switch, TextField } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { DeleteSection } from "../settings/DeleteSection";
import { ChangePasswordForm } from "../../auth/ChangePasswordForm";

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
    <Grid sx={{ width: 500 }} justifySelf="center" container direction="column" spacing={2}>
      <Grid sx={{ width: "100%" }}>
        <InputLabel>{"Display Name"}</InputLabel>
        <TextField fullWidth onChange={e => setDisplayName(e.target.value)} value={displayName} onBlur={e => changeDisplayName(e.target.value)} />
      </Grid>
      <Grid sx={{ width: "100%" }}>
        <InputLabel>{"Qualifying Period"}</InputLabel>
        <PeriodSelector profile={profile} />
      </Grid>
      <Grid>
        <InputLabel>{"Public Profile"}</InputLabel>
        <Switch size="medium" title="test" checked={isPublic} onChange={changeIsPublic} />
        {isPublic && (
          <IconButton size="small" onClick={copyProfileUrl} title="Copy URL">
            <ContentCopy fontSize="small" />
          </IconButton>
        )}
      </Grid>
      <Divider />
      <ChangePasswordForm />
      <Divider />
      <DeleteSection />
    </Grid>
  );
};
