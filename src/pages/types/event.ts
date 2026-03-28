import { Timestamp } from "firebase/firestore";

export type Event = {
  id: string;
  title: string;
  date: Timestamp;
  ownerId: string;
  createdAt: Timestamp;
  ownerName?: string;
};
