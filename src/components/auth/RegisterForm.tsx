import { useState } from "react";
import styles from "./RegisterForm.module.scss";
import { useRegister } from "../../hooks/useRegister";
import { validatePassword } from "../../utils/validations";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const { register, successMessage, error, loading } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors({ ...errors, password: passwordError });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }

    setErrors({ ...errors, password: "", confirmPassword: "" });
    register(formData.email, formData.password);
  };

  return (
    <div className={styles.signinBox}>
      <h2>Register</h2>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {!successMessage && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
            required
            autoComplete="email"
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className={styles.input}
            required
            autoComplete="new-password"
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={styles.input}
            required
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <div className={styles.loading}>Registering...</div>
          ) : (
            <button type="submit" className={styles.signInButton}>
              Sign up
            </button>
          )}
        </form>
      )}
      {!successMessage && (
        <div className={styles.switchForm}>
          Already have an account? <a href="/signin">Log in</a>
        </div>
      )}
      {successMessage && (
        <div className={styles.switchForm}>
          <a href="/signin">Back to log in</a>
        </div>
      )}
    </div>
  );
};
