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

type EventType = {
  id: string;
  title: string;
  date: Timestamp;
  ownerId: string;
};

export const Home = () => {
  const navigate = useNavigate();
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
          />
        ))
      )}
    </div>
  );
};
