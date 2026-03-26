import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getVisitedEvents } from "./services/visitedEventsService";
import { getEventById } from "./services/eventService";
import type { VisitedEvent } from "./types/visitedEvent";
import { UpcomingCard } from "./components/UpcomingCard";
import { ConfirmModal } from "./components/ConfirmModal";

export const Upcoming = () => {
  const events: VisitedEvent[] = getVisitedEvents();
  const navigate = useNavigate();

  const [invalidEvent, setInvalidEvent] = useState<string | null>(null);

  const handleOpenEvent = async (eventId: string) => {
    const event = await getEventById(eventId);

    if (!event) {
      setInvalidEvent(eventId);
      return;
    }

    navigate(`/event/${eventId}`);
  };

  return (
    <div>
      {events.length === 0 ? (
        <p className="empty-state__title">
          Збережених <br /> подій немає
        </p>
      ) : (
        events.map((event) => (
          <UpcomingCard
            key={event.eventId}
            title={event.title}
            date={event.date}
            reserved={0}
            total={0}
            onClick={() => handleOpenEvent(event.eventId)}
          />
        ))
      )}

      {invalidEvent && (
        <ConfirmModal
          title="Подію не знайдено"
          text="Ця подія була видалена або більше не існує"
          cancelText="Закрити"
          onConfirm={() => {
            setInvalidEvent(null);
            navigate("/home");
          }}
          onCancel={() => setInvalidEvent(null)}
        />
      )}
    </div>
  );
};
