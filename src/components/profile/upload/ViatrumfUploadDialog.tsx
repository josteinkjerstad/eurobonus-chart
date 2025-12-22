import { Dialog, DialogContent, DialogTitle, DialogActions, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import type { Profile } from "../../../models/profile";
import type { ViatrumfTransaction } from "../../../models/viatrumf_transaction";
import { ViatrumfUpload } from "./ViatrumfUpload";
import { ProfileSelection } from "../components/ProfileSelection";
import { useUploadViatrumfTransactions } from "../../../hooks/useUploadViatrumfTransactions";
import { Status } from "../../../enums/status";

type ViatrumfUploadDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  selectedProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  onUpload?: () => void;
};

export const ViatrumfUploadDialog = ({ isOpen, onClose, profiles, selectedProfile, onProfileChange, onUpload }: ViatrumfUploadDialogProps) => {
  const [viatrumfText, setViatrumfText] = useState("");
  const { upload, loading } = useUploadViatrumfTransactions();

  const parseViatrumfText = (text: string): string => {
    const startIndex = text.indexOf("Status");
    const endIndex = text.indexOf("Slik fungerer det");
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Invalid input format");
    }
    return text.substring(startIndex + "Status".length, endIndex).trim();
  };

  const handleUpload = async () => {
    try {
      const cleanedText = parseViatrumfText(viatrumfText);
      const lines = cleanedText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

      const parsedTransactions: ViatrumfTransaction[] = [];
      const statusValues = Object.values(Status);

      for (let i = 0; i < lines.length; ) {
        const statusIndex = statusValues.includes(lines[i + 4] as Status) ? i + 4 : i + 5;

        const transaction: ViatrumfTransaction = {
          store: lines[i],
          purchase_date: new Date(lines[i + 1].split(".").reverse().join("-")).toISOString(),
          purchase_amount: parseFloat(lines[i + 2].replace("Kr ", "").replace(",", ".")),
          trumf_bonus: parseFloat(lines[i + 3].replace("Kr ", "").replace(",", ".")),
          status: lines[statusIndex] as Status,
          profile_id: selectedProfile.id,
        };

        parsedTransactions.push(transaction);

        i += statusIndex === i + 4 ? 5 : 6;
      }

      await upload(selectedProfile.id, parsedTransactions);
      onUpload?.();
    } catch (error) {
      alert(`Invalid input`);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Upload Viatrumf Transactions</DialogTitle>
      <DialogContent sx={{ overflow: "auto" }}>
        <ProfileSelection profiles={profiles} selectedProfile={selectedProfile} onProfileChange={onProfileChange} />
        <div style={{ paddingTop: 10 }}>
          Copy your entire viatrumf earnings page (Ctrl/Command-A) and paste it here.
          <br />
          Remember to click Show more / Se mer before copying to make sure all transactions are visible.
        </div>
        <ViatrumfUpload value={viatrumfText} onChange={setViatrumfText} />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button color="success" onClick={handleUpload} disabled={!viatrumfText || loading} variant="contained">
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
