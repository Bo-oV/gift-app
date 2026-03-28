import type { Timestamp } from "firebase/firestore";
import type { Gift } from "./gift";

export type Reservation = {
  ownerName: string;
  eventId: string;
  eventTitle: string;
  eventDate?: Timestamp;
  gifts: Gift[];
  myGifts: Gift[];
};
