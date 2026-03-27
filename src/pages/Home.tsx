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

type EventType = {
  id: string;
  title: string;
  date: Timestamp;
  ownerId: string;
};

export const Home = () => {
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <AppLoader />;
  }

  return (
    <div className="home">
      {events.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Подій ще немає</p>

          <div className="empty-state__subtitle">
            <p className="empty-state__subtitle--text">
              Для створення події <br /> натисніть на
            </p>

            <span className="empty-state__subtitle--arrow">↓</span>
          </div>
        </div>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            eventId={event.id}
          />
        ))
      )}
    </div>
  );
};
