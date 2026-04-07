import {
  collection,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firestore";
import { EventCard } from "./components/EventCard";
import "../pages/home.scss";
import { AppLoader } from "./components/AppLoader";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { EventActionsSheet } from "./components/EventActionsSheet";
import { createGoogleCalendarLink } from "@/utils/createGoogleCalendarLink";
import { getAppBaseUrl, getEventShareLink } from "@/utils/getEventShareLink";
import { ShareModal } from "./components/ShareModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { deleteEventWithGifts } from "./services/eventService";

type EventType = {
  id: string;
  title: string;
  date: Timestamp;
  ownerId: string;
};

export const Home = () => {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareModal, setShareModal] = useState<null | "qr" | "link" | "post">(
    null,
  );
  const [shareEventId, setShareEventId] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<
    string | null
  >(null);

  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleShare = (eventId: string) => {
    setActiveEventId(null);
    setShareEventId(eventId);
    setShareOpen(true);
  };

  useEffect(() => {
    if (authLoading) return;
    const loadEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const eventRef = collection(db, "events");
      const q = query(eventRef, where("ownerId", "==", user.uid));

      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventType, "id">),
      }));
      setEvents(eventsData);
      setLoading(false);
    };
    loadEvents();
  }, [user]);

  const activeEvent = events.find((e) => e.id === activeEventId);
  const shareEvent = events.find((event) => event.id === shareEventId) ?? null;

  if (loading) {
    return <AppLoader />;
  }

  const eventLink = shareEvent
    ? getEventShareLink(shareEvent.id)
    : getAppBaseUrl();
  const shareEventDateLabel = shareEvent
    ? new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(shareEvent.date.toDate())
    : "Дата події";
  const shareUserName = user?.displayName?.trim() || "Ім'я користувача";
  return (
    <div className="home">
      {events.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">
            <span className="empty-state__emoji">🎉</span>
            Створи <br />
            свою першу подію
          </p>

          <p className="empty-state__subtitle">
            Запроси друзів та збери ідеї подарунків <br /> в одному місці
          </p>

          <button
            className="empty-state__button"
            onClick={() => {
              navigate("/create-event");
            }}
          >
            <Plus size={28} /> Створити подію
          </button>
        </div>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            eventId={event.id}
            onOpenActions={() => setActiveEventId(event.id)}
            onShare={() => handleShare(event.id)}
          />
        ))
      )}
      <EventActionsSheet
        open={!!activeEventId}
        onClose={() => setActiveEventId(null)}
        onEdit={() => navigate(`/edit-event/${activeEventId}`)}
        onAddToCalendar={() => {
          if (!activeEvent) return;

          window.open(
            createGoogleCalendarLink({
              title: activeEvent.title,
              date: activeEvent.date,
            }),
          );
        }}
        onDelete={() => {
          setPendingDeleteEventId(activeEventId);
          setActiveEventId(null);
          setShowDeleteConfirm(true);
        }}
        isOwner={true}
      />

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
          title={shareEvent?.title}
          userName={shareUserName}
          dateLabel={shareEventDateLabel}
          onClose={() => {
            setShareModal(null);
            setShareEventId(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Видалити подію?"
          text="Цю дію неможливо скасувати"
          confirmText="Видалити"
          onCancel={() => {
            setShowDeleteConfirm(false);
            setPendingDeleteEventId(null);
          }}
          onConfirm={async () => {
            if (!pendingDeleteEventId) return;

            setShowDeleteConfirm(false);
            setPendingDeleteEventId(null);

            await deleteEventWithGifts(pendingDeleteEventId);

            setEvents((prev) =>
              prev.filter((e) => e.id !== pendingDeleteEventId),
            );
          }}
        />
      )}
    </div>
  );
};
