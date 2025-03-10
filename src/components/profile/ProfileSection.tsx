import { useState } from "react";
import { Button, Card, Elevation, H2, H3, H4 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";
import { GroupMember } from "./GroupMember";
import { ProfileSettings } from "./ProfileSettings";
import { CsvUpload } from "../upload/CsvUpload";
import { Content as UploadContent } from "../../content/upload.md";
import { DeleteTransactionsButton } from "../upload/DeleteTransactionsButton";

type ProfileSectionProps = {
  profile: Profile;
  familyMembers: Profile[];
};

export const ProfileSection = ({
  profile,
  familyMembers,
}: ProfileSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState(familyMembers);

  const addMember = async (name: string) => {
    const response = await fetch("/api/profile/add-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, parentId: profile.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to add member");
    }

    const newMember = (await response.json()) as Profile;
    setMembers([...members, newMember]);
  };

  return (
    <div
      className="profile-section"
      style={{
        display: "flex",
        gap: 20,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        elevation={Elevation.TWO}
        style={{ width: "75%", alignSelf: "center" }}
      >
        <ProfileSettings profile={profile} />
      </Card>
      <Card elevation={Elevation.TWO} style={{ width: "75%" }}>
        <H4>Point Sharing Members</H4>
        {members.map((member) => (
          <GroupMember
            key={member.id}
            member={member}
            onDelete={(id) => setMembers(members.filter((m) => m.id !== id))}
          />
        ))}
        <Button onClick={() => setIsOpen(true)}>Add Family Member</Button>
        {isOpen && (
          <AddFamilyMemberDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={(name) => addMember(name)}
          />
        )}
      </Card>
      <Card elevation={Elevation.TWO} style={{ width: "75%" }}>
        <H4>Upload Transactions</H4>
        <p>
          To display your data, please download the transaction file from your
          SAS profile and upload it here.
        </p>
        <CsvUpload profiles={[profile, ...members]} />
      </Card>
      <Card
        elevation={Elevation.TWO}
        style={{ width: "75%", marginTop: "20px" }}
      >
        <H4>Actions</H4>
        <DeleteTransactionsButton />
      </Card>
    </div>
  );
};
