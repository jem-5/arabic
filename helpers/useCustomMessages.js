export const getErrorMsg = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already exists";
    case "auth/internal-error":
      return "Internal error";
    case "auth/invalid-credential":
      return "Incorrect email or password";
    case "auth/invalid-display-name":
      return "Display name invalid";
    case "auth/invalid-email":
      return "Email invalid";
    case "auth/user-not-found":
      return "User not found";
    default:
      return "";
  }
};
