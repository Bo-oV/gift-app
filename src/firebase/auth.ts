import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const REDIRECT_PENDING_KEY = "google_redirect_pending";

export const hasPendingGoogleRedirectSignIn = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(REDIRECT_PENDING_KEY) === "1";
};

export const signInWithGoogle = async () => {
  sessionStorage.setItem(REDIRECT_PENDING_KEY, "1");
  await signInWithRedirect(auth, provider);
  return null;
};

export const completeGoogleRedirectSignIn = async () => {
  try {
    return await getRedirectResult(auth);
  } finally {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    }
  }
};
