import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firestore";
import toast from "react-hot-toast";
import type { Event } from "../types/event";
import "../components/addGiftModal.scss";
import { InputWithAction } from "@/components/Input/InputWithAction";
import { Textarea } from "@/components/Input/Textarea";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { Link, Plus, Type, X } from "lucide-react";
import { InlineLoader } from "./InlineLoader";

type Props = {
  eventId: string;
  onClose: () => void;
  event: Event | null;
};

export const AddGiftModal = ({ eventId, onClose, event }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [purchaseUrl, setPurchaseUrl] = useState<string>("");
  const [preview, setPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const fetchPreview = async (url: string) => {
    try {
      const res = await fetch(`https://api.microlink.io?url=${url}`);
      const data = await res.json();

      const preview = data.data;

      if (!preview || !preview.title) {
        throw new Error("No preview data");
      }

      const title = preview.title || "";
      const description = preview.description || preview.text || title;

      return {
        title,
        description,
        image: preview.image?.url,
      };
    } catch (e) {
      console.log(e);
      setPreviewError(true);
      return null;
    }
  };

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

  useEffect(() => {
    if (!purchaseUrl || !isValidUrl(purchaseUrl)) return;

    const timeout = setTimeout(() => {
      setLoadingPreview(true);
      setPreviewError(false);
      fetchPreview(purchaseUrl)
        .then((data) => {
          if (!data) return;

          setPreview(data);

          setTitle((prev) => (prev ? prev : data.title));

          setDescription(data.description.slice(0, 100));
        })
        .finally(() => setLoadingPreview(false));
    }, 600);

    return () => clearTimeout(timeout);
  }, [purchaseUrl]);

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
      preview,
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

  const isAutoFilled = Boolean(purchaseUrl && title && !loadingPreview);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-overlay__close" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {loadingPreview && (
          <div className="modal-loader">
            <InlineLoader />
            <span>Заповнюємо поля...</span>
          </div>
        )}
        {previewError && (
          <p className="preview-error">
            😿 Нажаль не вдалося отримати дані. Введіть їх вручну
          </p>
        )}
        <InputWithAction
          icon={<Link size={18} />}
          label="Посилання на подарунок"
          placeholder="Встав посилання — заповнимо автоматично"
          actionText="Вставити"
          value={purchaseUrl}
          onChange={setPurchaseUrl}
          error={!isUrlValid}
        />

        <Input
          label="Назва подарунка"
          placeholder="Або введи вручну"
          icon={<Type size={18} />}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          error={!title}
        />

        {!isAutoFilled && (
          <Textarea
            label="Опис (необовʼязково)"
            placeholder="Текст"
            max={100}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 100))}
          />
        )}
        <p className="modal-info">*-поля обов'язкові для вводу</p>
        {isAutoFilled && (
          <p className="auto-filled-hint">✔ Дані заповнено автоматично</p>
        )}
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
