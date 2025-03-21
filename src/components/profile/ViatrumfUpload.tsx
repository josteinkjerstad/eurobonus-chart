import { useState } from "react";
import { TextArea, Spinner, H6 } from "@blueprintjs/core";
import type { ViatrumfTransaction } from "../../models/viatrumf_transaction";
import { useUploadViatrumfTransactions } from "../../hooks/useUploadViatrumfTransactions";
import { Status } from "../../enums/status";
import styles from "./ViatrumfUpload.module.scss";

type ViatrumfUploadProps = {
  profileId: string;
};

export const ViatrumfUpload = ({ profileId }: ViatrumfUploadProps) => {
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
          purchase_date: new Date(
            lines[i + 1].split(".").reverse().join("-") // Input format: dd.mm.yyyy
          ).toISOString(),
          purchase_amount: parseFloat(lines[i + 2].replace("Kr ", "").replace(",", ".")),
          trumf_bonus: parseFloat(lines[i + 3].replace("Kr ", "").replace(",", ".")),
          status: lines[statusIndex] as Status,
          profile_id: profileId,
        };

        parsedTransactions.push(transaction);

        i += statusIndex === i + 4 ? 5 : 6;
      }

      await upload(profileId, parsedTransactions);
    } catch (error) {
      alert(`Invalid input`);
    }
  };

  return (
    <>
      <H6>Viatrumf Upload</H6>
      Copy your entire viatrumf earnings page (Ctrl/Command-A) and paste it here.
      <br />
      Make sure to click "Show more /Se mer" before copying to make sure all transactions are visible.
      <div style={{ display: "flex", width: 450, flexDirection: "row", gap: "10px" }}>
        <TextArea value={viatrumfText} onChange={e => setViatrumfText(e.target.value)} placeholder="Paste your viatrumf transactions here" fill />
        <button onClick={() => handleUpload()} disabled={loading || viatrumfText == ""} className={styles.button}>
          {loading ? <Spinner size={20} /> : "Upload"}
        </button>
      </div>
    </>
  );
};
