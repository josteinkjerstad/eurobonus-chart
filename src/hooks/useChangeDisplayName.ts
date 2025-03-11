import { useCallback } from "react";

export const useChangeDisplayName = (profileId: string, setDisplayName: (name: string) => void) => {
  return useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayName(event.target.value);
      const response = await fetch("/api/profile/change-display-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name: event.target.value, profile_id: profileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update display name");
      }
    },
    [profileId, setDisplayName]
  );
};
