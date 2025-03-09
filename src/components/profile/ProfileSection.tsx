import { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Card,
  Elevation,
  UL,
  H3,
  Label,
} from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { supabase } from "../../lib/supabase";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";

type ProfileSectionProps = {
  profile: Profile;
};

export const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const [familyMembers, setFamilyMembers] = useState<Profile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("parent_id", profile.id);
      setFamilyMembers(data || []);
    };
    fetchFamilyMembers();
  }, [profile.id]);

  const changeIsPublic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await supabase
      .from("profiles")
      .update({ public: event.target.checked })
      .eq("user_id", profile.user_id);
  };

  const addFamilyMember = async (data: {
    display_name: string;
    public: boolean;
  }) => {
    await supabase.from("profiles").insert({ ...data, parent_id: profile.id });
    const { data: updatedFamilyMembers } = await supabase
      .from("profiles")
      .select("*")
      .eq("parent_id", profile.id);
    setFamilyMembers(updatedFamilyMembers || []);
  };

  return (
    <>
      <Card elevation={Elevation.TWO} style={{ marginBottom: "16px" }}>
        <H3>Profile</H3>
        <Label>
          Display Name: {profile.display_name || "Anonymous"}
        </Label>
          <Switch
            label="Public"
            checked={profile.public}
            onChange={changeIsPublic}
          />
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
            onSubmit={addFamilyMember}
          />
        )}
      </Card>
    </>
  );
};
