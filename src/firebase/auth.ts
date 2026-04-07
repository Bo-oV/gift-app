import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const REDIRECT_PENDING_KEY = "google_redirect_pending";

const shouldUseRedirectSignIn = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const { hostname } = window.location;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocalhost) {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  return isAndroid || isIOS;
};

export const hasPendingGoogleRedirectSignIn = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(REDIRECT_PENDING_KEY) === "1";
};

export const signInWithGoogle = async () => {
  if (!shouldUseRedirectSignIn()) {
    return await signInWithPopup(auth, provider);
  }

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
