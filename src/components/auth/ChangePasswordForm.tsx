import { useState } from "react";
import styles from "./ChangePasswordForm.module.scss";
import { useChangePassword } from "../../hooks/useChangePassword";
import { validatePassword } from "../../utils/validations";
import { H5 } from "@blueprintjs/core";

export const ChangePasswordForm = () => {
  const { changePassword, loading, successMessage, error } = useChangePassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setPasswordError("");
    await changePassword(newPassword, confirmPassword);
  };

  return (
    <div className={styles.changePasswordContainer}>
      <H5>Change Password</H5>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className={styles.input}
          required
          autoComplete="new-password"
        />
        {passwordError && <p className={styles.error}>{passwordError}</p>}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};
