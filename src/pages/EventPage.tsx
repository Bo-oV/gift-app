import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddGiftModal } from "./components/AddGiftModal";
import { GiftCard } from "./components/GiftCard";
import type { Event } from "./types/event";
import type { Gift } from "./types/gift";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { getEventById } from "./services/eventService";
import { subscribeToGifts } from "./services/giftService";
import { addVisitedEvent } from "./services/visitedEventsService";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigation = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);

  const [showAddGift, setShowAddGift] = useState(false);

  const userReservation = gifts.find((gift) => gift.reservedBy === user?.uid);

  const handleCopyLink = async () => {
    if (!eventId) return;

    const link = `${window.location.origin}/event/${eventId}`;
    await navigator.clipboard.writeText(link);

    toast.success("Link copied!");
  };

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        const event = await getEventById(eventId);

        if (!event) {
          setError("Event not found");
          return;
        }

        setEvent(event);

        if (user && event.ownerId !== user.uid) {
          addVisitedEvent({
            eventId: eventId,
            title: event.title,
            date: event.date.toMillis(),
          });
        }
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = subscribeToGifts(eventId, setGifts);

    return () => unsubscribe();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) {
    console.error("Event missing");
    return;
  }

  return (
    <div>
      <h1>{event.title}</h1>

      <p>{event.date.toDate().toLocaleDateString()}</p>

      {event.ownerId === user?.uid && (
        <button onClick={() => navigation(`/edit-event/${eventId}`)}>
          Edit
        </button>
      )}

      <button onClick={handleCopyLink}>Copy Link</button>

      {gifts.length === 0 ? (
        <p>No gifts yet</p>
      ) : (
        gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            eventId={eventId!}
            ownerId={event.ownerId}
            userReservation={userReservation?.id}
          />
        ))
      )}

      {showAddGift && eventId && event && (
        <AddGiftModal
          eventId={eventId}
          event={event}
          onClose={() => setShowAddGift(false)}
        />
      )}

      {event.ownerId === user?.uid && (
        <button onClick={() => setShowAddGift(true)}>Add Gifts</button>
      )}
    </div>
  );
};
