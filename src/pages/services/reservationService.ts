import { db } from "@/firebase/firestore";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export const cancelReservation = async (eventId: string, giftId: string) => {
  const giftRef = doc(db, "events", eventId, "gifts", giftId);

  await updateDoc(giftRef, {
    reservedBy: null,
  });
};

export const reserveGift = async (
  eventId: string,
  giftId: string,
  userId: string,
) => {
  const giftRef = doc(db, "events", eventId, "gifts", giftId);

  await updateDoc(giftRef, {
    reservedBy: userId,
  });
};

export const deleteGift = async (eventId: string, giftId: string) => {
  const giftRef = doc(db, "events", eventId, "gifts", giftId);

  await deleteDoc(giftRef);
};
