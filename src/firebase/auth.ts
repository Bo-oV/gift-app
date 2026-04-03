import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const handleRedirectResult = async () => {
  const result = await getRedirectResult(auth);

  if (result) {
    return result.user;
  }

  return null;
};
