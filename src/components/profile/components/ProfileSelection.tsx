import { FormControl, FormLabel } from "@mui/material";
import type { Profile } from "../../../models/profile";
import { SelectDropdown } from "../../shared/SelectDropdown";

type ProfileSelectionProps = {
  profiles: Profile[];
  selectedProfile: Profile;
  onProfileChange: (profile: Profile) => void;
};

export const ProfileSelection = ({ profiles, selectedProfile, onProfileChange }: ProfileSelectionProps) => {
  if (profiles.length <= 1) {
    return null;
  }

  return (
    <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
      <FormLabel>Selected Profile</FormLabel>
      <div style={{ paddingTop: 5, width: 300 }}>
        <SelectDropdown options={profiles} selectedOption={selectedProfile} optionLabel={p => p.display_name!} onChange={onProfileChange} />
      </div>
    </FormControl>
  );
};
