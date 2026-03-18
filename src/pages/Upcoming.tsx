import { useNavigate } from "react-router-dom";
import { getVisitedEvents } from "./services/visitedEventsService";
import type { VisitedEvent } from "./types/visitedEvent";
import { UpcomingCard } from "./components/UpcomingCard";

export const Upcoming = () => {
  const events: VisitedEvent[] = getVisitedEvents();
  const navigate = useNavigate();

  return (
    <div>
      {events.length === 0 ? (
        <p>No viewed events yet</p>
      ) : (
        events.map((event) => (
          <UpcomingCard
            key={event.eventId}
            title={event.title}
            date={event.date}
            reserved={0}
            total={0}
            onClick={() => navigate(`/event/${event.eventId}`)}
          />
        ))
      )}
    </div>
  );
};
