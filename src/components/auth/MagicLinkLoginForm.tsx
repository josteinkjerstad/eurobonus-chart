import { useState } from "react";
import { useSendMagicLink } from "../../hooks/useSendMagicLink";
import styles from "./MagicLinkLoginForm.module.scss";

export const MagicLinkLoginForm = () => {
  const { forgotPassword, successMessage, error, loading } = useSendMagicLink();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h2>Send Magic Link (OTP)</h2>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} required />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        Go back to <a href="/signin">Log in</a>
      </div>
    </div>
  );
};
