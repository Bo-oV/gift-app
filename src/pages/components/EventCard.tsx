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
import { useShareContext } from "@/context/ShareContext";
import { IconButton } from "@/components/Button/IconButton";
import { MoreVertical } from "lucide-react";
import { EventActionsSheet } from "./EventActionsSheet";
import { createGoogleCalendarLink } from "@/utils/createGoogleCalendarLink";

type Props = {
  id: string;
  title: string;
  date: Timestamp;
  eventId: string;
};

export const EventCard = ({ id, title, date, eventId }: Props) => {
  const { openShare } = useShareContext();
  const [total, setTotal] = useState<number | null>(null);
  const [reserved, setReserved] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
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

  const handleEdit = () => {
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
        reserved={reserved}
        total={total}
      />

      <div className="event-card__actions">
        <Button
          text="Поділитися подією"
          variant="primary"
          icon={<Link size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            openShare(id);
          }}
        />
        {/* <IconButton
          icon={<Link size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            openShare(id);
          }}
          ariaLabel="Copy link"
        /> */}

        <IconButton
          icon={<MoreVertical size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(true);
          }}
          ariaLabel="Actions"
        />
      </div>
      <EventActionsSheet
        open={showActions}
        onClose={() => setShowActions(false)}
        onEdit={handleEdit}
        onAddToCalendar={() => {
          window.open(
            createGoogleCalendarLink({
              title,
              date,
            }),
          );
        }}
        onDelete={() => {
          console.log("delete", id);
        }}
        isOwner={true}
      />
    </div>
  );
};
