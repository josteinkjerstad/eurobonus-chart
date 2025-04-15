export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 8 characters long.";
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasNumber) {
    return "Password must contain at least one number.";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character.";
  }
  return "";
};

export const isValidGuid = (guid: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(guid);
