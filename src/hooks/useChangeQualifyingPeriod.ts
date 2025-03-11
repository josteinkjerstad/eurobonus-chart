import { useCallback } from "react";

export const useChangeQualifyingPeriod = (profileId: string, setQualifyingPeriod: (period: number) => void) => {
  return useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPeriod = parseInt(event.target.value);
      setQualifyingPeriod(newPeriod);
      const response = await fetch("/api/profile/change-qualification-period", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_id: profileId, month: newPeriod }),
      });

      if (!response.ok) {
        throw new Error("Failed to update qualifying period");
      }
    },
    [profileId, setQualifyingPeriod]
  );
};
