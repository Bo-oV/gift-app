import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/Button";
import { Pencil, Link } from "lucide-react";
import { IconButton } from "@/components/Button/IconButton";
import "../components/eventCard.scss";
import { useEffect, useState } from "react";
import { subscribeToGifts } from "../services/giftService";
import type { Gift as Gifts } from "../types/gift";
import { getColorClass } from "@/utils/getColorClass";
import { EventCardHeader } from "@/components/EventCardHeader";
import { useShareContext } from "@/context/ShareContext";

type Props = {
  id: string;
  title: string;
  date: Timestamp;
  eventId: string;
};

export const EventCard = ({ id, title, date, eventId }: Props) => {
  const { openShare } = useShareContext();
  const [total, setTotal] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToGifts(id, (gifts: Gifts[]) => {
      setLoaded(true);

      const totalGifts = gifts.length;
      const reservedGifts = gifts.filter((gift) => gift.reservedBy).length;

      setTotal(totalGifts);
      setReserved(reservedGifts);
    });

    return () => unsubscribe();
  }, [id]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-event/${id}`);
  };

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
        reserved={loaded ? reserved : undefined}
        total={loaded ? total : undefined}
      />

      <div className="event-card__actions">
        <IconButton
          icon={<Link size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            openShare(id);
          }}
          ariaLabel="Copy link"
        />

        <Button
          onClick={handleEdit}
          text="Редагувати"
          icon={<Pencil size={20} />}
          variant="secondary"
        />
      </div>
    </div>
  );
};
