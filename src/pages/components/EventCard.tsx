import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/Button/Button";
import { Pencil, Link, Gift } from "lucide-react";
import { IconButton } from "@/components/Button/IconButton";
import "../components/eventCard.scss";
import { useEffect, useState } from "react";
import { subscribeToGifts } from "../services/giftService";
import type { Gift as Gifts } from "../types/gift";

type Props = {
  id: string;
  title: string;
  date: Timestamp;
  index: number;
};

export const EventCard = ({ id, title, date, index }: Props) => {
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

  const colors = [
    "event-card--pink",
    "event-card--purple",
    "event-card--blue",
    "event-card--green",
    "event-card--yellow",
  ];

  const colorClass = colors[index % colors.length];

  return (
    <div
      className={`event-card ${colorClass}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/event/${id}`)}
    >
      <div className="event-card__header">
        <h3 className="event-card__title">{title}</h3>
        <div className="event-card__header-bottom">
          <p className="event-card__date">
            {date.toDate().toLocaleDateString()}
          </p>
          <span className="event-card__gifts">
            {reserved}/{total} <Gift size={14} />
          </span>
        </div>
      </div>

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
