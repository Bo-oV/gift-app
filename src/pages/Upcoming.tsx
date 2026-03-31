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
import { EventActionsSheet } from "./components/EventActionsSheet";
import { ShareModal } from "./components/ShareModal";

type EventWithStats = VisitedEvent & {
  total: number;
  reserved: number;
};

export const Upcoming = () => {
  const navigate = useNavigate();
  const events: VisitedEvent[] = getVisitedEvents();

  const [eventsWithStats, setEventsWithStats] = useState<EventWithStats[]>([]);
  const [invalidEvent, setInvalidEvent] = useState<string | null>(null);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareModal, setShareModal] = useState<null | "qr" | "link" | "post">(
    null,
  );
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result: EventWithStats[] = [];

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
  }, [events]);

  // перевірка чи подія минула
  const isPastEvent = (date: number) => {
    return new Date(date) < new Date();
  };

  const handleOpenEvent = async (eventId: string, isDisabled: boolean) => {
    if (isDisabled) {
      setInvalidEvent(eventId);
      return;
    }

    const event = await getEventById(eventId);

    if (!event) {
      setInvalidEvent(eventId);
      return;
    }

    navigate(`/event/${eventId}`);
  };

  const handleShare = (eventId: string, isDisabled: boolean) => {
    if (isDisabled) {
      setInvalidEvent(eventId);
      return;
    }

    setActiveEventId(eventId);
    setShareOpen(true);
  };

  const eventLink = `${window.location.origin}/event/${activeEventId}`;

  return (
    <div className="upcoming">
      {events.length === 0 ? (
        <p className="empty-state__title">
          Збережених <br /> подій немає
        </p>
      ) : (
        eventsWithStats.map((event) => {
          const disabled = isPastEvent(event.date);

          return (
            <UpcomingCard
              key={event.eventId}
              title={event.title}
              date={event.date}
              reserved={event.reserved}
              total={event.total}
              isDisabled={disabled} // 🔥 ключове
              onClick={() => handleOpenEvent(event.eventId, disabled)}
              onShare={() => handleShare(event.eventId, disabled)}
            />
          );
        })
      )}

      {/* SHARE SHEET */}
      <EventActionsSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onGenerateQR={() => {
          setShareOpen(false);
          setShareModal("qr");
        }}
        onCopyLink={() => {
          setShareOpen(false);
          setShareModal("link");
        }}
        onSocialPost={() => {
          setShareOpen(false);
          setShareModal("post");
        }}
      />

      {/* SHARE MODAL */}
      {shareModal && (
        <ShareModal
          link={eventLink}
          mode={shareModal}
          onClose={() => setShareModal(null)}
        />
      )}

      {/* INVALID EVENT */}
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
