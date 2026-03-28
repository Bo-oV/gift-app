import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddGiftModal } from "./components/AddGiftModal";
import { LoginModal } from "./components/LoginModal";

import type { Event } from "./types/event";
import type { Gift } from "./types/gift";

import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { getEventById } from "./services/eventService";
import { subscribeToGifts } from "./services/giftService";
import { addVisitedEvent } from "./services/visitedEventsService";

import {
  cancelReservation,
  deleteGift,
  reserveGift,
} from "./services/reservationService";

import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/Button/IconButton";
import { GiftCard } from "./components/GiftCard";
import { AppLoader } from "./components/AppLoader";

import { useShareContext } from "@/context/ShareContext";

import { Pencil, Plus, Gift as GiftIcon, Link } from "lucide-react";

import "../pages/event-page.scss";

type PendingAction = { type: "reserve"; payload: string } | { type: "share" };

export const EventPage = () => {
  const { openShare } = useShareContext();
  const { eventId } = useParams();
  const navigation = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [loginTitle, setLoginTitle] = useState("");

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

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
      openShare(eventId);
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
            <IconButton
              icon={<Link size={18} />}
              onClick={(e) => {
                e.stopPropagation();

                if (!user) {
                  setPendingAction({ type: "share" });
                  openLoginModal(`Поділись подією 🎉`);
                  return;
                }

                if (!eventId) return;

                openShare(eventId);
              }}
              ariaLabel="Share"
            />

            {event.ownerId === user?.uid && (
              <Button
                text="Редагувати"
                icon={<Pencil size={16} />}
                variant="secondary"
                onClick={handleEdit}
              />
            )}
          </div>
        </div>
      </div>

      {/* GIFTS */}
      <div className="gift-list">
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            title={gift.title}
            description={gift.description}
            link={gift.purchaseUrl}
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
            text="Додати"
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
    </div>
  );
};
