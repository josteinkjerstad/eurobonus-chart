import { useState } from "react";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const changePassword = async (newPassword: string, confirmPassword: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const input = new FormData();
      input.append("newPassword", newPassword);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        body: input,
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      setSuccessMessage("Password updated successfully.");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, successMessage, error };
};
