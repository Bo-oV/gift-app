import { Gift } from "lucide-react";
import "../components/eventCardHeader.scss";
import { IconButton } from "./Button/IconButton";
import { MoreVertical } from "lucide-react";

type Props = {
  ownerName?: string;
  title: string;
  date?: string;
  reserved: number | null;
  total: number | null;
  onActionsClick?: (e: React.MouseEvent) => void;
};

export const EventCardHeader = ({
  ownerName,
  title,
  date,
  reserved,
  total,
  onActionsClick,
}: Props) => {
  return (
    <div className="event-card-header">
      <div className="event-card-header__top">
        <div className="event-card-header__title-block">
          <h3 className="event-card-header__title">{title}</h3>

          {ownerName && <p className="event-card-header__owner">{ownerName}</p>}
        </div>

        {onActionsClick && (
          <IconButton
            icon={<MoreVertical size={18} />}
            onClick={(e) => {
              e.stopPropagation();
              onActionsClick(e);
            }}
            ariaLabel="Actions"
          />
        )}
      </div>

      <div className="event-card-header__meta">
        {date && <span className="event-card-header__date">{date}</span>}

        <span className="event-card-header__count">
          {total === null ? "..." : `${reserved}/${total}`}
          <Gift size={14} />
        </span>
      </div>
    </div>
  );
};
