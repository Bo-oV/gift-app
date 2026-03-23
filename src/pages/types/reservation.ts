import type { Timestamp } from "firebase/firestore";

export type Reservation = {
  eventId: string;
  eventTitle: string;
  eventDate?: Timestamp;
  gifts: {
    id: string;
    title: string;
    description: string;
    reservedBy?: string | null;
  }[];
};
