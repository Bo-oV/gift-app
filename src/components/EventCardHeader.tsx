import { Gift } from "lucide-react";

type Props = {
  title: string;
  date?: string;
  reserved: number;
  total: number;
  onClick?: () => void;
};

export const EventCardHeader = ({
  title,
  date,
  reserved,
  total,
  onClick,
}: Props) => {
  return (
    <div
      className="event-card-header"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <h3 className="event-card-header__title">{title}</h3>

      <div className="event-card-header__meta">
        {date && <span className="event-card-header__date">{date}</span>}
        <span className="event-card-header__count">
          {reserved}/{total} <Gift size={14} />
        </span>
      </div>
    </div>
  );
};
