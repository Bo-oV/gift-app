import "./upcomingCard.scss";
import { Gift, Link } from "lucide-react";
import { Button } from "@/components/Button/Button";

type Props = {
  title: string;
  date: number;
  reserved: number;
  total: number;
  onClick?: () => void;
  onShare?: () => void;
  isDisabled?: boolean;
};

export const UpcomingCard = ({
  title,
  date,
  reserved,
  total,
  onClick,
  onShare,
  isDisabled,
}: Props) => {
  return (
    <div
      className={`upcoming-card ${isDisabled ? "upcoming-card--disabled" : ""}`}
      onClick={() => {
        if (isDisabled) return; // ❌ блокуємо
        onClick?.();
      }}
    >
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
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (isDisabled) return;
              onShare?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};
