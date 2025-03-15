import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button, FileInput, Spinner, SpinnerSize, HTMLSelect } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";

type CsvUploadProps = {
  profiles: Profile[];
  onUpload: (input: FormData) => Promise<void>;
};

export const CsvUpload = ({ profiles, onUpload }: CsvUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile>(profiles[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleProfileSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const profile = profiles.find(p => p.id === event.target.value);
    setSelectedProfile(profile!);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProfile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("profile_id", selectedProfile.id);

    setIsLoading(true);
    await onUpload(formData);
    setIsLoading(false);
  };

  return (
    <div>
      {profiles.length > 1 && (
        <HTMLSelect
          onChange={handleProfileSelect}
          value={selectedProfile.id}
          options={profiles.map(profile => ({
            value: profile.id,
            label: profile.display_name,
          }))}
          style={{ marginBottom: "10px", minWidth: "200px" }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <FileInput text={selectedFile?.name ?? "No file selected"} onInputChange={handleFileSelect} inputProps={{ accept: ".xlsx,.xls" }} />
        <Button text="Upload" onClick={handleUpload} disabled={!selectedFile || isLoading} intent="primary" />
      </div>
      {isLoading && <Spinner size={SpinnerSize.SMALL} />}
    </div>
  );
};
