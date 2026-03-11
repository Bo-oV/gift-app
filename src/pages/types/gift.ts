import { Timestamp } from "firebase/firestore";

export type Gift = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  purchaseUrl?: string;
  reservedBy?: string | null;
  eventId: string;
  eventTitle?: string;
  createdAt: Timestamp;
};
