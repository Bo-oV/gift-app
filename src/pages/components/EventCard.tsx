import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/Button/Button";
import { Pencil, Link } from "lucide-react";
import { IconButton } from "@/components/Button/IconButton";
import "../components/eventCard.scss";
import { useEffect, useState } from "react";
import { subscribeToGifts } from "../services/giftService";
import type { Gift as Gifts } from "../types/gift";
import { getColorClass } from "@/utils/getColorClass";
import { EventCardHeader } from "@/components/EventCardHeader";
import "@/components/eventCardHeader.scss";

type Props = {
  id: string;
  title: string;
  date: Timestamp;
  eventId: string;
};

export const EventCard = ({ id, title, date, eventId }: Props) => {
  const [total, setTotal] = useState(0);
  const [reserved, setReserved] = useState(0);

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
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const link = `${window.location.origin}/event/${id}`;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

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
        reserved={reserved}
        total={total}
      />

      <div className="event-card__actions">
        <IconButton
          icon={<Link size={16} />}
          onClick={handleCopyLink}
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
