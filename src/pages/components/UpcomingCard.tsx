import "./upcomingCard.scss";
import { Gift, Link } from "lucide-react";
import { Button } from "@/components/Button/Button";

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
    <div className="upcoming-card" onClick={onClick}>
      <div className="upcoming-card__content">
        {/* LEFT */}
        <div className="upcoming-card__left">
          <h3 className="upcoming-card__title">{title}</h3>

          <div className="upcoming-card__meta">
            <span className="upcoming-card__count">
              {reserved}/{total}
              <Gift size={14} />
            </span>

            <span className="upcoming-card__date">
              {new Date(date).toLocaleDateString("uk-UA")}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="upcoming-card__right">
          <Button
            variant="primary"
            icon={<Link size={16} />}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onClick?.();
            }}
          />
          {/* <IconButton
            icon={<Link size={16} />}
            ariaLabel="Open event"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onClick?.();
            }}
          /> */}
        </div>
      </div>
    </div>
  );
};
