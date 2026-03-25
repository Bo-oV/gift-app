import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { app } from "./config";

export const db = getFirestore(app);

export const createUserIfNotExists = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
  }
};

export const updateUserProfile = async (
  uid: string,
  data: { displayName?: string; photoURL?: string | null },
) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, data);
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.data();
};
