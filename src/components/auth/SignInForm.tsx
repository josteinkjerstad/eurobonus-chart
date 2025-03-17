import { useState } from "react";
import styles from "./SignInForm.module.scss";
import SocialLoginButtons from "./SocialLoginButtons";
import { useSignIn } from "../../hooks/useSignIn";

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { signIn, error } = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ ...errors, email: "Email is required." });
      return;
    }

    if (!formData.password) {
      setErrors({ ...errors, password: "Password is required." });
      return;
    }

    setErrors({ email: "", password: "" });
    signIn(formData.email, formData.password);
  };

  return (
    <div className={styles.signinBox}>
      <h2>Sign In</h2>
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
          autoComplete="current-password"
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.signInButton}>
          Sign in
        </button>
      </form>
      <div className={styles.socialLogin}>
        <SocialLoginButtons />
      </div>
      <div className={styles.createAccount}>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
      <div className={styles.createAccount}>
        <a href="/register">Register</a> or <a href="/magic-link">Sign up with a magic link</a>
      </div>
    </div>
  );
};

export default SignInForm;
