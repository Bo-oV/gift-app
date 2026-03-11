import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  collectionGroup,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import toast from "react-hot-toast";
import type { GiftReservation } from "./types/reservation";
import { useNavigate } from "react-router-dom";

export const MyReservations = () => {
  const { user } = useAuth();

  const [gifts, setGifts] = useState<GiftReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collectionGroup(db, "gifts"),
      where("reservedBy", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const giftData = docSnap.data();
        const eventId = docSnap.ref.parent.parent?.id as string;

        return {
          id: docSnap.id,
          title: giftData.title,
          description: giftData.description,
          reservedBy: giftData.reservedBy,
          eventId,
          eventTitle: giftData.eventTitle,
        };
      });

      setGifts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCancelReservation = async (gift: GiftReservation) => {
    const giftRef = doc(db, "events", gift.eventId, "gifts", gift.id);

    await updateDoc(giftRef, {
      reservedBy: null,
    });

    toast.success("Reservation canceled");
  };

  return (
    <div>
      <h1>My Reservations</h1>

      {loading ? (
        <p>Loading reservations...</p>
      ) : gifts.length === 0 ? (
        <p>No reservations yet</p>
      ) : (
        gifts.map((gift) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/event/${gift.eventId}`)}
            key={gift.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <h3 style={{ marginBottom: "4px" }}>{gift.title}</h3>

            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              Event: {gift.eventTitle}
            </p>

            <button
              onClick={() => handleCancelReservation(gift)}
              style={{ marginTop: "8px" }}
            >
              Cancel Reservation
            </button>
          </div>
        ))
      )}
    </div>
  );
};
