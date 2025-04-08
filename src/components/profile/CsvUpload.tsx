import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button, FileInput, Spinner, SpinnerSize, HTMLSelect, Label, H6 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { SelectDropdown } from "../shared/SelectDropdown";
import styles from "./CsvUpload.module.scss";

type CsvUploadProps = {
  profileId: string;
  onUpload: (input: FormData) => Promise<void>;
};

export const CsvUpload = ({ profileId, onUpload }: CsvUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("profile_id", profileId);

    setIsLoading(true);
    await onUpload(formData);
    setIsLoading(false);
  };

  return (
    <>
      <H6>SAS Transactions Upload</H6>
      To display your data, please download the transaction file from your SAS profile and upload it here.
      <br />
      All old transactions will automatically be removed when uploading a new file.
      <div style={{ display: "flex", flexDirection: "row", gap: "10px", paddingTop: 5 }}>
        <FileInput
          style={{ width: 360 }}
          text={selectedFile?.name ?? "No file selected"}
          onInputChange={handleFileSelect}
          inputProps={{ accept: ".xlsx,.xls" }}
        />
        <button onClick={() => handleUpload()} disabled={!selectedFile || isLoading} className={styles.button}>
          {isLoading ? <Spinner size={20} /> : "Upload"}
        </button>
      </div>
    </>
  );
};
