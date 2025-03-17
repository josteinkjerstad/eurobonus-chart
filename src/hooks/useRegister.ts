import { useState } from "react";

export const useRegister = () => {
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const register = async (email: string, password: string) => {
    setLoading(true);
    const input = new FormData();
    input.append("email", email);
    input.append("password", password);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: input,
      });

      if (response.ok) {
        setSuccessMessage("Account successfully created. \n Check your email to activate your account.");
        setError(undefined);
      } else {
        const errorText = await response.text();
        setError(JSON.parse(errorText).message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { register, successMessage, error, loading };
};
