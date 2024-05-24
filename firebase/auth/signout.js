import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}
