import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";

export const cancelReservation = async (eventId: string, giftId: string) => {
  const giftRef = doc(db, "events", eventId, "gifts", giftId);

  await updateDoc(giftRef, {
    reservedBy: null,
  });
};
