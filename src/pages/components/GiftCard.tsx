import "../components/giftCard.scss";
import { useAuth } from "../../context/useAuth";

import type { Gift } from "../types/gift";
import { Button } from "@/components/Button/Button";
import { ArrowRight, Pencil, Trash } from "lucide-react";

type Props = {
  gift: Gift;
  eventId: string;
  ownerId: string;
  userReservation?: string | null;
};

export const GiftCard = ({
  gift,
  // eventId,
  ownerId,
  // userReservation,
}: Props) => {
  const { user } = useAuth();

  const isOwner = user?.uid === ownerId;
  // const isReservedByUser = gift.reservedBy === user?.uid;

  // const giftRef = doc(db, "events", eventId, "gifts", gift.id);

  // const handleDelete = async () => {
  //   await deleteDoc(giftRef);
  // };
  // console.log("userReservation", userReservation);
  // console.log("gift.reservedBy", gift.reservedBy);
  // console.log("currentUser", user?.uid);

  // const handleReserve = async () => {
  //   if (!user) return;

  //   try {
  //     await runTransaction(db, async (transaction) => {
  //       const giftDoc = await transaction.get(giftRef);

  //       if (!giftDoc.exists()) {
  //         throw new Error("Gift not found");
  //       }

  //       if (giftDoc.data().reservedBy) {
  //         throw new Error("Already reserved");
  //       }

  //       transaction.update(giftRef, {
  //         reservedBy: user.uid,
  //       });
  //     });
  //   } catch (err) {
  //     toast.error("Gift already reserved");
  //     console.log(err);
  //   }
  // };

  // const handleCancelReservation = async () => {
  //   await cancelReservation(eventId, gift.id);
  // };

  return (
    <div className="gift-card">
      <div className="gift-card__content">
        <h3 className="gift-card__title">{gift.title}</h3>
        <p className="gift-card__desc">{gift.description}</p>
      </div>

      <div className="gift-card__actions">
        <Button
          text="Перейти"
          icon={<ArrowRight size={16} />}
          variant="ghost"
          disabled={!gift.purchaseUrl}
          onClick={(e) => {
            e.stopPropagation();
            if (gift.purchaseUrl) {
              window.open(gift.purchaseUrl, "_blank");
            }
          }}
        />

        {isOwner && (
          <>
            <Button
              text="Редагувати"
              icon={<Pencil size={16} />}
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                // 👉 відкриєш modal edit
              }}
            />

            <Button
              text="Видалити"
              icon={<Trash size={16} />}
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
