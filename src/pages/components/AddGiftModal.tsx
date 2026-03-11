import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firestore";
import toast from "react-hot-toast";

type Props = {
  eventId: string;
  onClose: () => void;
};

export const AddGiftModal = ({ eventId, onClose }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [purchaseUrl, setPurchaseUrl] = useState<string>("");

  const handleSubmit = async () => {
    console.log(title, description, imageUrl, eventId);
    if (!title) {
      alert("Title required");
      return;
    }
    await addDoc(collection(db, "events", eventId, "gifts"), {
      title,
      description,
      purchaseUrl,
      imageUrl,
      reserved: false,
      createdAt: serverTimestamp(),
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
