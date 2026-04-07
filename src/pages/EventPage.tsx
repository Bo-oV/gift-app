import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddGiftModal } from "./components/AddGiftModal";
import { LoginModal } from "./components/LoginModal";

import type { Event } from "./types/event";
import type { Gift } from "./types/gift";

import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { deleteEventWithGifts, getEventById } from "./services/eventService";
import { subscribeToGifts } from "./services/giftService";
import { addVisitedEvent } from "./services/visitedEventsService";

import {
  cancelReservation,
  deleteGift,
  reserveGift,
} from "./services/reservationService";

import { Button } from "@/components/Button/Button";
import { GiftCard } from "./components/GiftCard";
import { AppLoader } from "./components/AppLoader";

import { Plus, Gift as GiftIcon, Link } from "lucide-react";

import "../pages/event-page.scss";
import { IconButton } from "@/components/Button/IconButton";
import { MoreVertical } from "lucide-react";
import { EventActionsSheet } from "./components/EventActionsSheet";
import { createGoogleCalendarLink } from "@/utils/createGoogleCalendarLink";
import { ConfirmModal } from "./components/ConfirmModal";
import { Calendar } from "lucide-react";
import { ShareModal } from "./components/ShareModal";

type PendingAction = { type: "reserve"; payload: string } | { type: "share" };

export const EventPage = () => {
  {
    /* SHARE */
  }
  const [shareOpen, setShareOpen] = useState(false);
  const [shareModal, setShareModal] = useState<null | "qr" | "link" | "post">(
    null,
  );

  const navigate = useNavigate();
  const { eventId } = useParams();
  const navigation = useNavigate();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [loginTitle, setLoginTitle] = useState("");

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const handleDeleteEvent = async () => {
    if (!eventId) return;

    try {
      await deleteEventWithGifts(eventId);
      setShowDeleteConfirm(false);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const openLoginModal = (title: string) => {
    setLoginTitle(title);
    setShowLogin(true);
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);

    if (!pendingAction || !eventId || !user) return;

    if (pendingAction.type === "reserve") {
      reserveGift(eventId, pendingAction.payload, user.uid)
        .then(() => toast.success("Заброньовано"))
        .catch(() => toast.error("Помилка"));
    }

    if (pendingAction.type === "share") {
      setShareOpen(true);
    }

    setPendingAction(null);
  };

  const handleEdit = () => {
    if (!eventId) return;
    navigation(`/edit-event/${eventId}`);
  };

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      const event = await getEventById(eventId);
      if (!event) return;

      setEvent(event);

      if (user && event.ownerId !== user.uid) {
        addVisitedEvent({
          eventId,
          title: event.title,
          date: event.date.toMillis(),
        });
      }

      setLoading(false);
    };

    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    return subscribeToGifts(eventId, setGifts);
  }, [eventId]);

  const reserved = useMemo(
    () => gifts.filter((g) => g.reservedBy).length,
    [gifts],
  );

  const total = gifts.length;

  if (loading || !event) return <AppLoader />;
  const eventLink = `${window.location.origin}/event/${eventId}`;
  const shareDateLabel = new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(event.date.toDate());
  const shareUserName =
    user?.displayName?.trim() ||
    event.ownerName?.trim() ||
    "Ім'я користувача";
  return (
    <div className="event-page">
      {/* HEADER */}
      <div className="event-page__header">
        <div className="event-page__header-top">
          <div className="event-page__title-block">
            <h1 className="event-page__title">{event.title}</h1>

            {event.ownerId !== user?.uid && (
              <p className="event-page__owner">
                {event.ownerName || "Організатор"}
              </p>
            )}
          </div>

          <div className="event-page__meta">
            <span>{event.date.toDate().toLocaleDateString()}</span>

            <span className="event-page__gifts">
              {reserved} / {total} <GiftIcon size={14} />
            </span>
          </div>

          <div className="event-page__actions">
            <Button
              text="Поділитися подією"
              variant="primary"
              icon={<Link size={18} />}
              onClick={(e) => {
                e.stopPropagation();

                if (!user) {
                  setPendingAction({ type: "share" });
                  openLoginModal(`Поділись подією 🎉`);
                  return;
                }

                setShareOpen(true);
              }}
            />

            {event.ownerId !== user?.uid && (
              <Button
                text="Додати нагадування"
                variant="secondary"
                icon={<Calendar size={18} />}
                onClick={(e) => {
                  e.stopPropagation();

                  window.open(
                    createGoogleCalendarLink({
                      title: event.title,
                      date: event.date,
                    }),
                  );
                }}
              />
            )}

            {event.ownerId === user?.uid && (
              <IconButton
                icon={<MoreVertical size={18} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(true);
                }}
                ariaLabel="Actions"
              />
            )}
          </div>
        </div>
      </div>
      {/* SETTINGS */}
      <EventActionsSheet
        open={showActions}
        onClose={() => setShowActions(false)}
        onEdit={handleEdit}
        onAddToCalendar={() => {
          window.open(
            createGoogleCalendarLink({
              title: event.title,
              date: event.date,
            }),
          );
        }}
        onDelete={() => {
          setShowActions(false);
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

      {showDeleteConfirm && (
        <ConfirmModal
          title="Видалити подію?"
          text="Цю дію неможливо скасувати"
          confirmText="Видалити"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteEvent}
        />
      )}
      {/* GIFTS */}
      <div className="gift-list">
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            title={gift.title}
            description={gift.description}
            link={gift.purchaseUrl}
            preview={gift.preview}
            reservedBy={gift.reservedBy}
            currentUserId={user?.uid}
            ownerId={event.ownerId || ""}
            onReserve={() => {
              if (!user) {
                setPendingAction({
                  type: "reserve",
                  payload: gift.id,
                });

                openLoginModal("Майже готово 🎁");
                return;
              }

              if (!eventId) return;

              reserveGift(eventId, gift.id, user.uid)
                .then(() => toast.success("Заброньовано"))
                .catch(() => toast.error("Помилка"));
            }}
            onCancel={() => {
              cancelReservation(eventId!, gift.id)
                .then(() => toast.success("Скасовано"))
                .catch(() => toast.error("Помилка"));
            }}
            onDelete={() => {
              deleteGift(eventId!, gift.id)
                .then(() => toast.success("Видалено"))
                .catch(() => toast.error("Помилка"));
            }}
          />
        ))}
      </div>

      {/* ADD GIFT */}
      {showAddGift && eventId && (
        <AddGiftModal
          eventId={eventId}
          event={event}
          onClose={() => setShowAddGift(false)}
        />
      )}

      {/* FLOAT BUTTON */}
      {(event.ownerId === user?.uid || event.ownerId === null) && (
        <div className="event-page__add">
          <Button
            text="Додати подарунок"
            icon={<Plus size={16} />}
            variant="primary"
            onClick={() => setShowAddGift(true)}
          />
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          title={loginTitle}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* SHARE MODAL */}
      {shareModal && (
        <ShareModal
          link={eventLink}
          mode={shareModal}
          title={event.title}
          userName={shareUserName}
          dateLabel={shareDateLabel}
          onClose={() => setShareModal(null)}
        />
      )}
    </div>
  );
};
