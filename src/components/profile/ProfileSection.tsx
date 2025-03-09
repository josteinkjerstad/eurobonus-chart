import { useState } from "react";
import {
  Button,
  Switch,
  Card,
  Elevation,
  UL,
  H3,
  Label,
  InputGroup,
} from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";

type ProfileSectionProps = {
  profile: Profile;
  familyMembers: Profile[];
};

export const ProfileSection = ({
  profile,
  familyMembers,
}: ProfileSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(profile.public);
  const [displayName, setDisplayName] = useState(profile.display_name);

  const changeIsPublic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsPublic(newValue);
    const response = await fetch("/api/change-is-public", {
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

  const changeDisplayName = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = event.target.value;
    setDisplayName(newDisplayName);
    const response = await fetch("/api/change-display-name", {
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

  return (
    <div className="profile-section">
      <Card elevation={Elevation.TWO} style={{ marginBottom: "16px" }}>
        <H3>Profile</H3>
        <Label style={{ width: "auto" }}>
          Display Name
          <InputGroup
            value={displayName}
            onChange={changeDisplayName}
            style={{ width: "auto" }}
          />
        </Label>
          <Switch
            label="Public profile"
            checked={isPublic}
            onChange={changeIsPublic}
          />
          {isPublic && (
            <Button
              icon="clipboard"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/dashboard?id=${profile.id}`
                )
              }
            />
          )}
      </Card>
      <Card elevation={Elevation.TWO}>
        <H3>Family Members</H3>
        <UL>
          {familyMembers.map((member) => (
            <li key={member.id}>{member.display_name}</li>
          ))}
        </UL>
        <Button onClick={() => setIsOpen(true)}>Add Family Member</Button>
        {isOpen && (
          <AddFamilyMemberDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={() => console.log("wtf")}
          />
        )}
      </Card>
    </div>
  );
};
