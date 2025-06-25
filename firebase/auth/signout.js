import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signout() {
  try {
    await signOut(auth);
    // Sign-out successful.
  } catch (error) {
    // Handle error if needed
    console.error("Sign out error:", error);
  }
}
