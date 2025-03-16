import styles from "./SignInForm.module.scss";
import SocialLoginButtons from "./SocialLoginButtons";

const SignInForm = () => {
  return (
    <div className={styles.signinBox}>
      <h2>Sign In</h2>
      <form action="/api/auth/signin" method="post" className={styles.form}>
        <input type="email" name="email" placeholder="Email" required className={styles.input} />
        <input type="password" name="password" placeholder="Password" required className={styles.input} />
        <button type="submit" className={styles.signInButton}>
          Sign in
        </button>
      </form>
      <div className={styles.socialLogin}>
        <SocialLoginButtons />
      </div>
    </div>
  );
};

export default SignInForm;
