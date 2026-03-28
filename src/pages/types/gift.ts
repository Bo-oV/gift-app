import { Timestamp } from "firebase/firestore";

export type Gift = {
  id: string;
  title: string;
  description: string;
  preview?: {
    title?: string;
    description?: string;
    image?: string;
  };
  imageUrl?: string;
  purchaseUrl?: string;
  reservedBy?: string | null;
  eventId: string;
  eventTitle?: string;
  createdAt: Timestamp;
};
