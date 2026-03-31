import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/Button";
import { Link } from "lucide-react";
import "../components/eventCard.scss";
import { useEffect, useState } from "react";
import { subscribeToGifts } from "../services/giftService";
import type { Gift as Gifts } from "../types/gift";
import { getColorClass } from "@/utils/getColorClass";
import { EventCardHeader } from "@/components/EventCardHeader";
import { IconButton } from "@/components/Button/IconButton";
import { MoreVertical } from "lucide-react";

type Props = {
  onOpenActions: () => void;
  id: string;
  title: string;
  date: Timestamp;
  eventId: string;
  onShare: () => void;
};

export const EventCard = ({
  onOpenActions,
  id,
  title,
  date,
  eventId,
  onShare,
}: Props) => {
  const [total, setTotal] = useState<number | null>(null);
  const [reserved, setReserved] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToGifts(id, (gifts: Gifts[]) => {
      const totalGifts = gifts.length;
      const reservedGifts = gifts.filter((gift) => gift.reservedBy).length;

      setTotal(totalGifts);
      setReserved(reservedGifts);
    });

    return () => unsubscribe();
  }, [id]);

  const colorClass = getColorClass(eventId);

  return (
    <div
      className={`event-card ${colorClass}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/event/${id}`)}
    >
      <EventCardHeader
        title={title}
        date={date.toDate().toLocaleDateString()}
        reserved={reserved}
        total={total}
      />

      <div className="event-card__actions">
        <Button
          text="Поділитися подією"
          variant="primary"
          icon={<Link size={18} />}
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
        />

        <IconButton
          icon={<MoreVertical size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onOpenActions();
          }}
          ariaLabel="Actions"
        />
      </div>
    </div>
  );
};
