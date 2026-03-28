import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import type { Event } from "../types/event";

export const getEventById = async (eventId: string): Promise<Event | null> => {
  const docRef = doc(db, "events", eventId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const raw = docSnap.data();

  const event: Event = {
    id: docSnap.id,
    title: raw.title,
    date: raw.date,
    createdAt: raw.createdAt ?? Timestamp.now(),
    ownerId: raw.ownerId ?? "",
    ownerName: raw.ownerName ?? undefined,
  };

  // МІГРАЦІЯ ownerName
  if (!event.ownerName && event.ownerId) {
    try {
      await updateDoc(docRef, {
        ownerName: "User",
      });

      event.ownerName = "User";
    } catch (e) {
      console.log("Migration error:", e);
    }
  }

  // МІГРАЦІЯ createdAt (ВАЖЛИВО)
  if (!raw.createdAt) {
    try {
      await updateDoc(docRef, {
        createdAt: Timestamp.now(),
      });
    } catch (e) {
      console.log("createdAt migration error:", e);
    }
  }

  return event;
};
