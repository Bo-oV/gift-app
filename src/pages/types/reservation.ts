export type GiftReservation = {
  id: string;
  title: string;
  description?: string;
  reservedBy: string;
  eventId: string;
  eventTitle?: string;
};
