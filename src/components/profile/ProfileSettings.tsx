import { useState } from "react";
import {
  Card,
  Elevation,
  H3,
  Label,
  InputGroup,
  Switch,
  Button,
  HTMLSelect,
  H4,
} from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { getAllValidQualifyingPeriods } from "../../models/qualifying-periods";
import { CsvUpload } from "../upload/CsvUpload";

type ProfileSettingsProps = {
  profile: Profile;
};

export const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [qualifyingPeriod, setQualifyingPeriod] = useState(
    profile.periode_start_month || 1
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
    <>
      <H4>Profile Settings</H4>
      <Label style={{ width: "300px" }}>
        Display Name
        <InputGroup value={displayName} onChange={changeDisplayName} />
      </Label>
      <Label style={{ width: "300px" }}>
        Qualifying Period
        <HTMLSelect
          value={qualifyingPeriod}
          onChange={changeQualifyingPeriod}
          options={qualifyingPeriods.map((period) => ({
            value: period.month,
            label: period.label,
          }))}
        />
      </Label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Switch
          label="Public profile"
          checked={isPublic}
          onChange={changeIsPublic}
        />
      </div>
    </>
  );
};
