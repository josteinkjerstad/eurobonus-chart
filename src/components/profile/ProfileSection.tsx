import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import type { Profile } from "../../models/profile";
import { ProfileSettings } from "./account/ProfileSettings";
import useFetchProfiles from "../../hooks/useFetchProfiles";
import styles from "./ProfileSection.module.scss";
import { MemberSection } from "./members/MemberSection";
import { UploadSection } from "./upload/UploadSection";
import { CircularProgress, Tabs, Tab, Card, Box, Grid } from "@mui/material";

enum TabsEnum {
  Profile = "Profile",
  Members = "Members",
  Upload = "Upload",
}

export const ProfileSection = () => {
  const { data, loading } = useFetchProfiles();
  const [members, setMembers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Profile);

  const profile = useMemo(() => data?.find(x => !x.parent_id) as Profile, [data]);
  useEffect(() => setMembers(data?.filter(x => x.parent_id) ?? []), [data]);

  const profiles = useMemo(() => [profile, ...members], [profile, members]);

  const updateProfileDisplayName = (id: string, newDisplayName: string) => {
    setMembers(prevMembers => prevMembers.map(member => (member.id === id ? { ...member, display_name: newDisplayName } : member)));
    if (profile?.id === id) {
      profile.display_name = newDisplayName;
    }
  };

  const handleTabChange = (_event: SyntheticEvent, newValue: TabsEnum) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.container}>
      <Box display="flex" justifyContent="center" width="100%">
        <Tabs
          style={{ paddingBottom: 10 }}
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Profile Settings" value={TabsEnum.Profile} />
          <Tab label="Point Sharing Members" value={TabsEnum.Members} />
          <Tab label="Upload" value={TabsEnum.Upload} />
        </Tabs>
      </Box>
      <Grid width="70%" alignSelf="center">
        {activeTab === TabsEnum.Profile && <ProfileSettings profile={profile} onUpdateDisplayName={updateProfileDisplayName} />}
        {activeTab === TabsEnum.Upload && <UploadSection profiles={profiles} />}
        {activeTab === TabsEnum.Members && <MemberSection members={members} onChange={setMembers} />}
      </Grid>
    </div>
  );
};
