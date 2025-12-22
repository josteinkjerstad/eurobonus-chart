import { Button, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { Profile } from "../../../models/profile";
import { useEffect, useState } from "react";
import { ViatrumfUploadDialog } from "./ViatrumfUploadDialog";
import { SasUploadDialog } from "./SasUploadDialog";

type UploadSectionProps = {
  profiles: Profile[];
};

export const UploadSection = ({ profiles }: UploadSectionProps) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile>();
  const [isSasDialogOpen, setIsSasDialogOpen] = useState(false);
  const [isViatrumfDialogOpen, setIsViatrumfDialogOpen] = useState(false);

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

  const onViatrumfUpload = () => {
    window.location.href = "/viatrumf";
  };

  if (!selectedProfile) {
    return;
  }

  return (
    <Grid justifySelf={"center"} width={400} container direction="column" spacing={2}>
      <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setIsSasDialogOpen(true)}>
        Upload SAS Transactions
      </Button>
      <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setIsViatrumfDialogOpen(true)}>
        Upload Viatrumf Transactions
      </Button>

      <SasUploadDialog
        isOpen={isSasDialogOpen}
        onClose={() => setIsSasDialogOpen(false)}
        profiles={profiles}
        selectedProfile={selectedProfile}
        onProfileChange={setSelectedProfile}
        onUpload={onSasUpload}
      />

      <ViatrumfUploadDialog
        isOpen={isViatrumfDialogOpen}
        onClose={() => setIsViatrumfDialogOpen(false)}
        profiles={profiles}
        selectedProfile={selectedProfile}
        onProfileChange={setSelectedProfile}
        onUpload={onViatrumfUpload}
      />
    </Grid>
  );
};
