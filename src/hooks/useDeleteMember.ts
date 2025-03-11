import { useCallback } from "react";

export const useDeleteMember = (memberId: string, onDelete: (id: string) => void) => {
  return useCallback(async () => {
    const response = await fetch("/api/profile/delete-member", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: memberId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete family member");
    } else {
      onDelete(memberId);
    }
  }, [memberId, onDelete]);
};
