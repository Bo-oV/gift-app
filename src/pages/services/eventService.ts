import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import type { Event } from "../types/event";

export const getEventById = async (eventId: string): Promise<Event | null> => {
  const eventRef = doc(db, "events", eventId);
  const snap = await getDoc(eventRef);

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Event, "id">;

  return {
    id: snap.id,
    ...data,
  };
};
