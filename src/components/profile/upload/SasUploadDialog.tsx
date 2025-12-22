import { Dialog, DialogContent, DialogTitle, DialogActions, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { CsvUpload } from "./CsvUpload";
import type { Profile } from "../../../models/profile";
import { ProfileSelection } from "../components/ProfileSelection";

type SasUploadDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  selectedProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  onUpload: (input: FormData) => Promise<void>;
};

export const SasUploadDialog = ({ isOpen, onClose, profiles, selectedProfile, onProfileChange, onUpload }: SasUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("profile_id", selectedProfile.id);

    setIsLoading(true);
    await onUpload(formData);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Upload SAS Transactions</DialogTitle>
      <DialogContent sx={{ overflow: "auto" }}>
        <ProfileSelection profiles={profiles} selectedProfile={selectedProfile} onProfileChange={onProfileChange} />
        <div style={{ paddingTop: 10 }}>To display your data, please download the transaction file from your SAS profile and upload it here.</div>
        <CsvUpload selectedFile={selectedFile} onFileSelect={setSelectedFile} />
        <div style={{ color: "red", paddingTop: 10 }}>All old transactions will automatically be removed when uploading a new file.</div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose} disabled={isLoading} variant="outlined">
          Cancel
        </Button>
        <Button color="success" onClick={handleUpload} disabled={!selectedFile || isLoading} variant="contained">
          {isLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
