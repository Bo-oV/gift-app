import { useNavigate } from "react-router-dom";
import { getVisitedEvents } from "./services/visitedEventsService";
import type { VisitedEvent } from "./types/visitedEvent";

export const Upcoming = () => {
  const events: VisitedEvent[] = getVisitedEvents();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Upcoming events</h1>

      {events.map((event) => (
        <button
          key={event.eventId}
          onClick={() => navigate(`/event/${event.eventId}`)}
        >
          <p>{event.title}</p>
          <p>{new Date(event.date).toLocaleDateString()}</p>
        </button>
      ))}
    </div>
  );
};
