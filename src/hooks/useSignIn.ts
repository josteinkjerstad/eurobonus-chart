import { useState } from "react";

export const useSignIn = () => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const input = new FormData();
      input.append("email", email);
      input.append("password", password);
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: input,
      });

      if (response.ok) {
        window.location.href = "/dashboard";
        setError(undefined);
      } else {
        setError("Incorrect email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { signIn, error, loading };
};
