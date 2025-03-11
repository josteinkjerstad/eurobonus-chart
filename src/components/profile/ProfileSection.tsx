import { useEffect, useMemo, useState } from "react";
import { Divider, Spinner } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { ProfileSettings } from "./ProfileSettings";
import useFetchProfiles from "../../hooks/useFetchProfiles";
import styles from "./ProfileSection.module.scss";
import { MemberSection } from "./MemberSection";
import { UploadSection } from "./UploadSection";
import { DeleteSection } from "./DeleteSection";

export const ProfileSection = () => {
  const { data, loading } = useFetchProfiles();
  const [members, setMembers] = useState<Profile[]>([]);

  const profile = useMemo(() => data?.find(x => !x.parent_id) as Profile, [data]);
  useEffect(() => setMembers(data?.filter(x => x.parent_id) ?? []), [data]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <ProfileSettings profile={profile} />
      <Divider />
      <MemberSection members={members} onChange={setMembers} />
      <Divider />
      <UploadSection profiles={[profile, ...members]} />
      <Divider />
      <DeleteSection />
    </div>
  );
};
