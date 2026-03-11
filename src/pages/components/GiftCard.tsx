import { doc, runTransaction, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import type { Gift } from "../types/gift";
import { cancelReservation } from "../services/reservationService";

type Props = {
  gift: Gift;
  eventId: string;
  ownerId: string;
  userReservation?: string | null;
};

export const GiftCard = ({
  gift,
  eventId,
  ownerId,
  userReservation,
}: Props) => {
  const { user } = useAuth();

  const isOwner = user?.uid === ownerId;
  const isReservedByUser = gift.reservedBy === user?.uid;

  const giftRef = doc(db, "events", eventId, "gifts", gift.id);

  const handleDelete = async () => {
    await deleteDoc(giftRef);
  };
  console.log("userReservation", userReservation);
  console.log("gift.reservedBy", gift.reservedBy);
  console.log("currentUser", user?.uid);

  const handleReserve = async () => {
    if (!user) return;

    try {
      await runTransaction(db, async (transaction) => {
        const giftDoc = await transaction.get(giftRef);

        if (!giftDoc.exists()) {
          throw new Error("Gift not found");
        }

        if (giftDoc.data().reservedBy) {
          throw new Error("Already reserved");
        }

        transaction.update(giftRef, {
          reservedBy: user.uid,
        });
      });
    } catch (err) {
      toast.error("Gift already reserved");
      console.log(err);
    }
  };

  const handleCancelReservation = async () => {
    await cancelReservation(eventId, gift.id);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "10px",
      }}
    >
      {gift.imageUrl && (
        <img
          src={gift.imageUrl}
          alt={gift.title}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      )}

      <h3>{gift.title}</h3>
      <p>{gift.description}</p>
      {gift.purchaseUrl && (
        <button onClick={() => window.open(gift.purchaseUrl, "_blank")}>
          View Gift
        </button>
      )}

      {isOwner && <button onClick={handleDelete}>Delete Gift</button>}

      {!isOwner && !gift.reservedBy && !userReservation && (
        <button onClick={handleReserve}>Reserve</button>
      )}

      {!isOwner && isReservedByUser && (
        <button onClick={handleCancelReservation}>Cancel Reservation</button>
      )}

      {!isOwner && !gift.reservedBy && userReservation && !isReservedByUser && (
        <button disabled>You already reserved a gift</button>
      )}

      {!isOwner && gift.reservedBy && !isReservedByUser && (
        <button disabled>Reserved</button>
      )}
    </div>
  );
};
