import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVisitedEvents } from "./services/visitedEventsService";
import { getEventById } from "./services/eventService";
import type { VisitedEvent } from "./types/visitedEvent";
import { UpcomingCard } from "./components/UpcomingCard";
import { ConfirmModal } from "./components/ConfirmModal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import "../pages/upcoming.scss";

type EventWithStats = VisitedEvent & {
  total: number;
  reserved: number;
};

export const Upcoming = () => {
  const events: VisitedEvent[] = getVisitedEvents();
  const navigate = useNavigate();
  const [eventsWithStats, setEventsWithStats] = useState<EventWithStats[]>([]);

  const [invalidEvent, setInvalidEvent] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = [];

      for (const event of events) {
        const giftsRef = collection(db, "events", event.eventId, "gifts");
        const snapshot = await getDocs(giftsRef);

        const gifts = snapshot.docs.map((doc) => doc.data());

        const total = gifts.length;
        const reserved = gifts.filter((g) => g.reservedBy).length;

        result.push({
          ...event,
          total,
          reserved,
        });
      }

      setEventsWithStats(result);
    };

    load();
  }, []);

  const handleOpenEvent = async (eventId: string) => {
    const event = await getEventById(eventId);

    if (!event) {
      setInvalidEvent(eventId);
      return;
    }

    navigate(`/event/${eventId}`);
  };

  return (
    <div className="upcoming">
      {events.length === 0 ? (
        <p className="empty-state__title">
          Збережених <br /> подій немає
        </p>
      ) : (
        eventsWithStats.map((event) => (
          <UpcomingCard
            key={event.eventId}
            title={event.title}
            date={event.date}
            reserved={event.reserved}
            total={event.total}
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
