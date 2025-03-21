import { useEffect, useMemo, useState } from "react";
import { Card, Divider, Spinner } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { ProfileSettings } from "./ProfileSettings";
import useFetchProfiles from "../../hooks/useFetchProfiles";
import styles from "./ProfileSection.module.scss";
import { MemberSection } from "./MemberSection";
import { UploadSection } from "./UploadSection";
import { DeleteSection } from "./DeleteSection";
import { ChangePasswordForm } from "../auth/ChangePasswordForm";

export const ProfileSection = () => {
  const { data, loading } = useFetchProfiles();
  const [members, setMembers] = useState<Profile[]>([]);

  const profile = useMemo(() => data?.find(x => !x.parent_id) as Profile, [data]);
  useEffect(() => setMembers(data?.filter(x => x.parent_id) ?? []), [data]);

  const profiles = useMemo(() => [profile, ...members], [profile, members]);

  const updateProfileDisplayName = (id: string, newDisplayName: string) => {
    setMembers(prevMembers => prevMembers.map(member => (member.id === id ? { ...member, display_name: newDisplayName } : member)));
    if (profile?.id === id) {
      profile.display_name = newDisplayName;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <ProfileSettings profile={profile} onUpdateDisplayName={updateProfileDisplayName} />
      <MemberSection members={members} onChange={setMembers} />
      <UploadSection profiles={profiles} />
      <ChangePasswordForm />
    </div>
  );
};
