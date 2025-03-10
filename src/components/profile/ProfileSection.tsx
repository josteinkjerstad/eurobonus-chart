import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Elevation,
  H2,
  H3,
  H4,
  Spinner,
} from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";
import { GroupMember } from "./GroupMember";
import { ProfileSettings } from "./ProfileSettings";
import { CsvUpload } from "../upload/CsvUpload";
import { DeleteTransactionsButton } from "../upload/DeleteTransactionsButton";
import useFetchProfiles from "../../hooks/useFetchProfiles";

export const ProfileSection = () => {
  const { data, loading } = useFetchProfiles();
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<Profile[]>([]);

  const profile = useMemo(() => data?.find((x) => !x.parent_id), [data]);
  useEffect(() => setMembers(data?.filter((x) => x.parent_id) ?? []), [data]);

  const onNewMember = (member: Profile) => {
    setMembers([...members, member]);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!profile) {
    return "No profile found";
  }

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
            onAdd={onNewMember}
          />
        )}
      </Card>
      <Card elevation={Elevation.TWO} style={{ width: "75%" }}>
        <H4>Upload Transactions</H4>
        <p>
          To display your data, please download the transaction file from your
          SAS profile and upload it here.
          <br />
          All old transactions will automatically be removed when uploading a
          new file.
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
