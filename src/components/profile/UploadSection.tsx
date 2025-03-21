import { Card, Divider, H5, Label } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { CsvUpload } from "./CsvUpload";
import { useEffect, useState } from "react";
import { SelectDropdown } from "../shared/SelectDropdown";
import { ViatrumfUpload } from "./ViatrumfUpload";

type UploadSectionProps = {
  profiles: Profile[];
};

export const UploadSection = ({ profiles }: UploadSectionProps) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile>();

  useEffect(() => {
    setSelectedProfile(profiles[0]);
  }, [profiles]);

  const onSasUpload = async (input: FormData) => {
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

  if (!selectedProfile) {
    return;
  }

  return (
    <Card>
      <H5>Upload Transactions</H5>
      {profiles.length > 1 && (
        <div style={{ display: "flex", gap: 10, minWidth: "300px" }}>
          <Label>
            Selected Profile
            <div style={{ paddingTop: 5, minWidth: "300px" }}>
              <SelectDropdown options={profiles} selectedOption={selectedProfile} optionLabel={p => p.display_name!} onChange={setSelectedProfile} />
            </div>
          </Label>
        </div>
      )}
      <CsvUpload onUpload={onSasUpload} profileId={selectedProfile.id} />
      <Divider style={{ paddingTop: 10, marginBottom: 10 }} />
      <ViatrumfUpload profileId={selectedProfile.id} />
    </Card>
  );
};
