const SocialLoginButtons = () => {
  return (
    <>
      <form action="/api/auth/signin" method="post">
        <button
          value="google"
          name="provider"
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            color: "black",
            border: "1px solid black",
            padding: "10px 20px",
            borderRadius: "30px",
            marginBottom: "10px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google logo"
            style={{ width: "20px", height: "20px", marginRight: "10px", borderRadius: "50%" }}
          />
          Sign in with Google
        </button>
      </form>
      <form action="/api/auth/signin" method="post">
        <button
          value="github"
          name="provider"
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#24292e",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "30px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub logo"
            style={{ width: "20px", height: "20px", marginRight: "10px" }}
          />
          Sign in with GitHub
        </button>
      </form>
    </>
  );
};

export default SocialLoginButtons;
