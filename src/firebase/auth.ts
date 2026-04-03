import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};
