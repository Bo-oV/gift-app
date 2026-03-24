import "../components/giftItem.scss";
import { ArrowRight, Gift, X } from "lucide-react";
import { Button } from "@/components/Button/Button";

type Props = {
  title: string;
  description: string;
  link?: string;
  reservedBy?: string | null;
  currentUserId?: string | null;
  ownerId: string;
  onReserve: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

export const GiftCard = ({
  title,
  description,
  link,
  reservedBy,
  currentUserId,
  ownerId,
  onReserve,
  onCancel,
  onDelete,
}: Props) => {
  const isOwner = ownerId === currentUserId;
  const isReserved = !!reservedBy;
  const isMine = reservedBy === currentUserId;

  const stateClass = !isReserved
    ? "gift-item--available"
    : isMine
      ? "gift-item--mine"
      : "gift-item--taken";
  return (
    <div className={`gift-item ${stateClass}`}>
      <div className="gift-item__info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <div className="gift-item__actions">
        {/* ЛІНК */}
        <Button
          text={link ? "Перейти" : "Немає посилання"}
          icon={<ArrowRight size={16} />}
          variant="ghost"
          disabled={!link}
          onClick={(e) => {
            e.stopPropagation();
            if (link) window.open(link, "_blank");
          }}
        />

        {/* 👑 ВЛАСНИК */}
        {isOwner && (
          <Button
            text="Видалити"
            icon={<X size={16} />}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        )}

        {/* 👤 НЕ ВЛАСНИК */}
        {!isOwner && !isReserved && (
          <Button
            text="Забронювати"
            icon={<Gift size={16} />}
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onReserve();
            }}
          />
        )}

        {!isOwner && isMine && (
          <Button
            text="Скасувати"
            icon={<X size={16} />}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          />
        )}

        {!isOwner && isReserved && !isMine && (
          <Button text="Зайнято" variant="secondary" disabled />
        )}
      </div>
    </div>
  );
};
