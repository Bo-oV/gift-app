import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./auth";

GoogleAuth.initialize({
  clientId:
    "942839081000-vl0vn9g6hq2i2utlf6kdgcfa4e82nla1.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  grantOfflineAccess: true,
});

export const loginWithFirebase = async () => {
  console.log("STEP 1: start");

  const googleUser = await GoogleAuth.signIn();
  console.log("STEP 2: googleUser", googleUser);

  const credential = GoogleAuthProvider.credential(
    googleUser.authentication.idToken,
  );

  console.log("STEP 3: credential");

  const result = await signInWithCredential(auth, credential);
  console.log("STEP 4: SUCCESS", result);

  return result;
};
