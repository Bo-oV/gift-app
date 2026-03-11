import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};
