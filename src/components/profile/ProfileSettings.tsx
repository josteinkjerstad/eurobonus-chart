import { useState } from "react";
import { Label, InputGroup, Switch, HTMLSelect, H4 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import styles from "./ProfileSettings.module.scss";

type ProfileSettingsProps = {
  profile: Profile;
};

export const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [qualifyingPeriod, setQualifyingPeriod] = useState(
    profile.periode_start_month
  );
  const qualifyingPeriods = getAllValidQualifyingPeriods();

  const changeIsPublic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsPublic(newValue);
    const response = await fetch("/api/profile/change-is-public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public: newValue }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
  };

  const changeDisplayName = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDisplayName = event.target.value;
    setDisplayName(newDisplayName);
    const response = await fetch("/api/profile/change-display-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ display_name: newDisplayName }),
    });

    if (!response.ok) {
      throw new Error("Failed to update display name");
    }
  };

  const changeQualifyingPeriod = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPeriod = parseInt(event.target.value);
    setQualifyingPeriod(newPeriod);
    const response = await fetch("/api/profile/change-qualification-period", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile_id: profile.id, month: newPeriod }),
    });

    if (!response.ok) {
      throw new Error("Failed to update qualifying period");
    }
  };

  return (
    <div className={styles.container}>
      <H4>Profile Settings</H4>
      <Label>
        Display Name
        <InputGroup value={displayName} onChange={changeDisplayName} />
      </Label>
      <Label>
        Qualifying Period
        <HTMLSelect
          value={qualifyingPeriod ?? ""}
          onChange={changeQualifyingPeriod}
          options={[
            { value: "", label: "Select a period" },
            ...qualifyingPeriods.map((period) => ({
              value: period.month,
              label: period.label,
            })),
          ]}
        />
      </Label>
      <Switch
        label="Public profile"
        checked={isPublic}
        onChange={changeIsPublic}
      />
    </div>
  );
};
