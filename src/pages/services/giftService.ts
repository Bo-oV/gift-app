import { collection, onSnapshot } from "firebase/firestore";
import type { Gift } from "../types/gift";
import { db } from "../../firebase/firestore";

export const subscribeToGifts = (
  eventId: string,
  callback: (gifts: Gift[]) => void,
) => {
  const giftsRef = collection(db, "events", eventId, "gifts");

  return onSnapshot(giftsRef, (snapshot) => {
    const gifts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Gift, "id">),
    }));

    callback(gifts);
  });
};
