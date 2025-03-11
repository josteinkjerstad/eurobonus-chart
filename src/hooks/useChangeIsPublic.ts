import { useCallback } from "react";

export const useChangeIsPublic = (setIsPublic: (isPublic: boolean) => void) => {
  return useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setIsPublic(newValue);
      const response = await fetch("/api/profile/change-is-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public: newValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
    },
    [setIsPublic]
  );
};
