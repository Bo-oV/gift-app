import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { EventForm } from "./components/EventForm";
import { useEffect, useState } from "react";

export const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      const eventRef = doc(db, "events", eventId);
      const snapshot = await getDoc(eventRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setTitle(data.title);
        setDate(data.date.toDate().toISOString().split("T")[0]);
      }

      setLoading(false);
    };

    loadEvent();
  }, [eventId]);

  const handleUpdate = async (title: string, date: Date) => {
    if (!eventId) return;

    const eventRef = doc(db, "events", eventId);

    await updateDoc(eventRef, {
      title,
      date: Timestamp.fromDate(new Date(date)),
    });

    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <EventForm
      initialTitle={title}
      initialDate={date}
      onSubmit={handleUpdate}
    />
  );
};
