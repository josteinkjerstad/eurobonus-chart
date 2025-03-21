import { useState } from "react";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";

export const useUploadViatrumfTransactions = () => {
  const [loading, setLoading] = useState(false);

  const upload = async (profileId: string, transactions: ViatrumfTransaction[]) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("viatrumf_transactions", JSON.stringify(transactions));
      formData.append("profile_id", profileId);

      const response = await fetch("/api/upload-viatrumf-transactions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Failed to upload Viatrumf transactions");
      } else {
        alert("Viatrumf transactions uploaded successfully");
      }
    } catch (error) {
      alert("An error occurred while uploading");
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading };
};
