import { useEffect, useMemo, useState } from "react";
import { Divider, Spinner } from "@blueprintjs/core";
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

  const onUpload = async (input: FormData) => {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: input,
    });

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      const errorText = await response.text();
      alert(`Error uploading transactions: ${errorText}`);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <ProfileSettings profile={profile} />
      <Divider />
      <MemberSection members={members} onChange={setMembers} />
      <Divider />
      <UploadSection onUpload={onUpload} profiles={[profile, ...members]} />
      <Divider />
      <ChangePasswordForm />
      <Divider />
      <DeleteSection />
    </div>
  );
};
