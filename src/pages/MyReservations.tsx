import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  collectionGroup,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Reservation } from "./types/reservation";
import { EventReservationCard } from "./components/EventReservationCard";
import { AppLoader } from "./components/AppLoader";

export const MyReservations = () => {
  const { user } = useAuth();

  const [gifts, setGifts] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collectionGroup(db, "gifts"),
      where("reservedBy", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const map = new Map();

      for (const docSnap of snapshot.docs) {
        const giftData = docSnap.data();
        const eventId = docSnap.ref.parent.parent?.id as string;

        if (!map.has(eventId)) {
          map.set(eventId, {
            eventId,
            eventTitle: giftData.eventTitle,
            eventDate: giftData.eventDate,
            gifts: [],
          });
        }
      }

      for (const [eventId, eventData] of map) {
        const giftsRef = collection(db, "events", eventId, "gifts");
        const giftsSnap = await getDocs(giftsRef);

        const allGifts = giftsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        eventData.gifts = allGifts;
        eventData.myGifts = snapshot.docs
          .filter((doc) => doc.ref.parent.parent?.id === eventId)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      }

      setGifts(Array.from(map.values()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCancelReservation = async (eventId: string, giftId: string) => {
    const giftRef = doc(db, "events", eventId, "gifts", giftId);

    await updateDoc(giftRef, {
      reservedBy: null,
    });

    toast.success("Reservation canceled");
  };

  if (loading) {
    return <AppLoader />;
  }

  if (gifts.length === 0) {
    return <p className="empty-state__title">Ще не обрано жодного подарунку</p>;
  }

  return (
    <div className="reservations">
      {gifts.map((event) => {
        const total = event.gifts.length;
        const reserved = event.gifts.filter((g) => g.reservedBy).length;

        return (
          <EventReservationCard
            eventId={event.eventId}
            key={event.eventId}
            title={event.eventTitle}
            date={event.eventDate?.toDate().getTime()}
            reserved={reserved}
            total={total}
            gifts={event.myGifts}
            onOpen={() => navigate(`/event/${event.eventId}`)}
            onCancel={(giftId) =>
              handleCancelReservation(event.eventId, giftId)
            }
          />
        );
      })}
    </div>
  );
};
