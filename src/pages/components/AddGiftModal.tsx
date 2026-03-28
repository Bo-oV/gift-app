import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firestore";
import toast from "react-hot-toast";
import type { Event } from "../types/event";
import "../components/addGiftModal.scss";
import { InputWithAction } from "@/components/Input/InputWithAction";
import { Textarea } from "@/components/Input/Textarea";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { Link, Plus, Type, X } from "lucide-react";

type Props = {
  eventId: string;
  onClose: () => void;
  event: Event | null;
};

export const AddGiftModal = ({ eventId, onClose, event }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [purchaseUrl, setPurchaseUrl] = useState<string>("");

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlValid = purchaseUrl ? isValidUrl(purchaseUrl) : true;
  const isFormValid = title.trim().length > 0 && isUrlValid;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Введи назву подарунку");
      return;
    }
    if (!isUrlValid) {
      toast.error("Некоректне посилання");
      return;
    }
    if (!event) return;
    await addDoc(collection(db, "events", eventId, "gifts"), {
      title,
      description,
      purchaseUrl,
      reservedBy: null,
      createdAt: serverTimestamp(),
      eventTitle: event.title,
      eventDate: event.date,
      ownerName: event.ownerName ?? "Невідомий",
    });
    setTitle("");
    setDescription("");
    setPurchaseUrl("");

    toast.success("Подарунок додано");
    onClose();
  };

  const isValid = title.trim().length > 0;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-overlay__close" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Input
          label="Назва подарунку"
          placeholder="Текст"
          icon={<Type size={18} />}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          error={!title}
        />

        <InputWithAction
          icon={<Link size={18} />}
          label="Посилання на подарунок"
          placeholder="URL"
          actionText="Вставити"
          value={purchaseUrl}
          onChange={setPurchaseUrl}
          error={!isUrlValid}
        />

        <Textarea
          label="Опис"
          placeholder="Текст"
          max={100}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="modal-info">*-поля обов'язкові для вводу</p>
        <Button
          text="Додати"
          icon={<Plus size={16} />}
          variant="ghost"
          disabled={!isValid && !isFormValid}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
