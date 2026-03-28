import "../components/giftCard.scss";
import { Gift, X } from "lucide-react";
import { Button } from "@/components/Button/Button";

type Props = {
  title: string;
  description: string;
  link?: string;
  preview?: {
    title?: string;
    description?: string;
    image?: string;
  };
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
  preview,
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
    ? "gift-card--available"
    : isMine
      ? "gift-card--mine"
      : "gift-card--taken";
  return (
    <div
      className={`gift-card ${stateClass}`}
      onClick={() => {
        if (link) window.open(link, "_blank");
      }}
    >
      <div className="gift-card__content">
        {/* PREVIEW */}
        {preview?.image && (
          <img
            src={preview.image}
            alt={preview.title}
            className="gift-card__image"
          />
        )}

        {/* TEXT */}
        <div className="gift-card__info">
          <h4 className="gift-card__title">{preview?.title || title}</h4>

          <p className="gift-card__desc">
            {preview?.description || description}
          </p>

          {link && (
            <span className="gift-card__domain">{new URL(link).hostname}</span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="gift-card__actions">
        {isOwner && (
          <Button
            text="Видалити"
            icon={<X size={16} />}
            disabled={isReserved}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        )}

        {!isOwner && !isReserved && (
          <Button
            text="Обрати"
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
            text="Відмінити"
            icon={<X size={16} />}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          />
        )}

        {!isOwner && isReserved && !isMine && (
          <Button text="Вже обрано" variant="ghost" disabled />
        )}
      </div>
    </div>
  );
};
