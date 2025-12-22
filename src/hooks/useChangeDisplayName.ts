import { useCallback } from "react";

export const useChangeDisplayName = (profileId: string, setDisplayName: (name: string) => void) => {
  return useCallback(
    async (newName: string) => {
      setDisplayName(newName);
      const response = await fetch("/api/profile/change-display-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name: newName, profile_id: profileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update display name");
      }
    },
    [profileId, setDisplayName]
  );
};
