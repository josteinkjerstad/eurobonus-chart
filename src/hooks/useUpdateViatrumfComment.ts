import { useState } from "react";

export const useUpdateViatrumfComment = () => {
  const [loading, setLoading] = useState(false);

  const updateComment = async (transactionId: number, comment: string) => {
    setLoading(true);
    try {
      await fetch("/api/update-viatrumf-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, comment }),
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, loading };
};
