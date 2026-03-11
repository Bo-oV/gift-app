import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
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

  const handleDeleteEvent = async () => {
    if (!eventId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) return;

    try {
      const giftsRef = collection(db, "events", eventId, "gifts");
      const giftsSnapshot = await getDocs(giftsRef);

      const deletePromises = giftsSnapshot.docs.map((docSnap) =>
        deleteDoc(docSnap.ref),
      );

      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "events", eventId));

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleUpdate = async (title: string, date: string) => {
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
      titleText="Edit Event"
      onDelete={handleDeleteEvent}
    />
  );
};
