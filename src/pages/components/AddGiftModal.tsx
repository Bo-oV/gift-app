import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firestore";
import toast from "react-hot-toast";
import type { Event } from "../types/event";

type Props = {
  eventId: string;
  onClose: () => void;
  event: Event | null;
};

export const AddGiftModal = ({ eventId, onClose, event }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [purchaseUrl, setPurchaseUrl] = useState<string>("");

  console.log("event:", event);
  const handleSubmit = async () => {
    console.log(title, description, imageUrl, eventId);
    if (!title) {
      alert("Title required");
      return;
    }
    if (!event) return;
    await addDoc(collection(db, "events", eventId, "gifts"), {
      title,
      description,
      purchaseUrl,
      imageUrl,
      reservedBy: null,
      createdAt: serverTimestamp(),
      eventTitle: event.title,
      eventDate: event.date,
    });
    toast.success("Gift added");
    onClose();
  };

  return (
    <div>
      <input
        placeholder="Text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Purchase link"
        value={purchaseUrl}
        onChange={(e) => setPurchaseUrl(e.target.value)}
      />
      <input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Gift</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
