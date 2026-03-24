import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddGiftModal } from "./components/AddGiftModal";
import type { Event } from "./types/event";
import type { Gift } from "./types/gift";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { getEventById } from "./services/eventService";
import { subscribeToGifts } from "./services/giftService";
import { addVisitedEvent } from "./services/visitedEventsService";

import { Button } from "@/components/Button/Button";

import { Share2, Pencil, Plus, Gift as GiftIcon } from "lucide-react";

import "../pages/event-page.scss";
import { IconButton } from "@/components/Button/IconButton";
import { GiftCard } from "./components/GiftCard";
import {
  cancelReservation,
  deleteGift,
  reserveGift,
} from "./services/reservationService";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigation = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);

  // const userReservation = gifts.find((g) => g.reservedBy === user?.uid);

  const handleCopyLink = async () => {
    if (!eventId) return;
    const link = `${window.location.origin}/event/${eventId}`;
    await navigator.clipboard.writeText(link);
    toast.success("Посилання скопійовано!");
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
  if (loading || !event) return <div>Loading...</div>;

  return (
    <div className="event-page">
      {/* HEADER */}
      <div className="event-page__header">
        <div className="event-page__header-top">
          <h1 className="event-page__title">{event.title}</h1>
          <div className="event-page__meta">
            <span>{event.date.toDate().toLocaleDateString()}</span>

            <span className="event-page__gifts">
              {reserved} / {total} <GiftIcon size={14} />
            </span>
          </div>
          <div className="event-page__actions">
            <IconButton
              icon={<Share2 size={18} />}
              ariaLabel="share"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCopyLink();
              }}
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
            ownerId={event.ownerId}
            onReserve={() => {
              if (!user) return;

              reserveGift(eventId!, gift.id, user.uid)
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

      {/* MODAL */}
      {showAddGift && eventId && (
        <AddGiftModal
          eventId={eventId}
          event={event}
          onClose={() => setShowAddGift(false)}
        />
      )}

      {/* FLOAT BUTTON */}
      {event.ownerId === user?.uid && (
        <div className="event-page__add">
          <Button
            text="Додати"
            icon={<Plus size={16} />}
            variant="primary"
            onClick={() => setShowAddGift(true)}
          />
        </div>
      )}
    </div>
  );
};
