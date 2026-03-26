import "./eventReservationCard.scss";
import { GiftItem } from "./GiftItem";
import { getColorClass } from "@/utils/getColorClass";
import { EventCardHeader } from "@/components/EventCardHeader";
import type { GiftPreview } from "../types/giftPreview";

type Props = {
  eventId: string;
  title: string;
  date?: number;
  reserved: number;
  total: number;
  gifts: GiftPreview[];
  onOpen: () => void;
  onCancel: (giftId: string) => void;
};

export const EventReservationCard = ({
  eventId,
  title,
  date,
  reserved,
  total,
  gifts,
  onOpen,
  onCancel,
}: Props) => {
  const colorClass = getColorClass(eventId);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : undefined;
  return (
    <div className={`reservation-card ${colorClass}`} onClick={onOpen}>
      <div className="reservation-card__content">
        {/* HEADER */}
        <EventCardHeader
          title={title}
          date={formattedDate}
          reserved={reserved}
          total={total}
          onClick={onOpen}
        />

        {/* <div className="reservation-card__right">
          <IconButton
            icon={<Link size={16} />}
            ariaLabel="Open event"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onOpen();
            }}
          />
        </div> */}
      </div>

      {gifts.map((gift) => (
        <GiftItem
          key={gift.id}
          title={gift.title}
          description={gift.description}
          link={gift.purchaseUrl}
          onOpen={(e?: React.MouseEvent<HTMLButtonElement>) => {
            e?.stopPropagation?.();
            onOpen();
          }}
          onCancel={(e?: React.MouseEvent<HTMLButtonElement>) => {
            e?.stopPropagation?.();
            onCancel(gift.id);
          }}
        />
      ))}
    </div>
  );
};
