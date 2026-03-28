import { Gift } from "lucide-react";
import "../components/eventCardHeader.scss";
type Props = {
  ownerName?: string;
  title: string;
  date?: string;
  reserved?: number;
  total?: number;
  onClick?: () => void;
};

export const EventCardHeader = ({
  ownerName,
  title,
  date,
  reserved,
  total,
  onClick,
}: Props) => {
  console.log(ownerName);
  return (
    <div
      className="event-card-header"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="event-card-header__top">
        <h3 className="event-card-header__title">{title}</h3>

        {ownerName && <p className="event-card-header__owner">{ownerName}</p>}
      </div>
      <div className="event-card-header__meta">
        {date && <span className="event-card-header__date">{date}</span>}
        <span className="event-card-header__count">
          {total === undefined ? "..." : `${reserved}/${total}`}{" "}
          <Gift size={14} />
        </span>
      </div>
    </div>
  );
};
