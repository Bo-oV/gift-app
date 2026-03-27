import "../components/giftCard.scss";
import { Gift, Link, X } from "lucide-react";
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
    ? "gift-card--available"
    : isMine
      ? "gift-card--mine"
      : "gift-card--taken";
  return (
    <div className={`gift-card ${stateClass}`}>
      <div className="gift-card__info">
        <h4 className="gift-card__title">{title}</h4>
        <p className="gift-card__desc">{description}</p>
      </div>

      <div className="gift-card__actions">
        {/* ЛІНК */}
        <Button
          text={link ? "Перейти" : ""}
          icon={link ? <Link size={16} /> : false}
          variant="ghost"
          disabled={!link}
          onClick={(e) => {
            e.stopPropagation();
            if (link) window.open(link, "_blank");
          }}
        />

        {/* ВЛАСНИК */}
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

        {/*НЕ ВЛАСНИК */}
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
