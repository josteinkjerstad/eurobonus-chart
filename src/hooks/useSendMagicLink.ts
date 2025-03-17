import { useState } from "react";

export const useSendMagicLink = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const input = new FormData();
      input.append("email", email);
      const response = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        body: input,
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      setSuccessMessage(
        "A magic link has been sent to your email. Click the link to access your account and change your password in profile settings"
      );
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, successMessage, error };
};
