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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {events.length === 0 ? (
        <p>No events yet</p>
      ) : (
        events.map((event, index) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            index={index}
          />
        ))
      )}
    </div>
  );
};
