import type { Timestamp } from "firebase/firestore";
import type { Gift } from "./gift";

export type Reservation = {
  eventId: string;
  eventTitle: string;
  eventDate?: Timestamp;
  gifts: Gift[];
  myGifts: Gift[];
};
