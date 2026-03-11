import { useAuth } from "../context/useAuth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { EventForm } from "./components/EventForm";

export const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateEvent = async (title: string, date: string) => {
    if (!user) return;

    const eventDate = Timestamp.fromDate(new Date(date));

    const docRef = await addDoc(collection(db, "events"), {
      title,
      date: eventDate,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    navigate(`/event/${docRef.id}`);
  };

  return <EventForm onSubmit={handleCreateEvent} titleText="Create Event" />;
};
