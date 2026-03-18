import { IconButton } from "@/components/Button/IconButton";
import "./upcomingCard.scss";
import { Link2, Gift } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

type Props = {
  title: string;
  date: number;
  reserved: number;
  total: number;
  onClick?: () => void;
};

export const UpcomingCard = ({
  title,
  date,
  reserved,
  total,
  onClick,
}: Props) => {
  return (
    <div className="reservation-card" onClick={onClick}>
      <div className="reservation-card__content">
        {/* LEFT */}
        <div className="reservation-card__left">
          <h3 className="reservation-card__title">{title}</h3>

          <div className="reservation-card__meta">
            <span className="reservation-card__count">
              {reserved}/{total}
              <Gift size={14} />
            </span>

            <span className="reservation-card__date">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="reservation-card__right">
          <IconButton
            icon={<Link2 size={18} />}
            ariaLabel="Open event"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onClick?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};
