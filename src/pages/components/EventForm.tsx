import { useState } from "react";
import { Check, PenLine, Trash } from "lucide-react";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { DateInput } from "@/components/DateInput/DateInput";
import { useNavigate } from "react-router-dom";
import "../components/eventForm.scss";

type Props = {
  initialTitle?: string;
  initialDate?: string;
  onSubmit: (title: string, date: Date) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export const EventForm = ({
  initialTitle = "",
  initialDate = "",
  onSubmit,
  onDelete,
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null,
  );
  const isFormValid = title.trim() !== "" && date !== null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!title) {
      alert("Need title");
      return;
    }

    if (!date) {
      alert("Need date");
      return;
    }

    setIsSubmitting(true);

    await onSubmit(title, date);

    setIsSubmitting(false);
  };

  return (
    <div className="event-form">
      <Input
        label="Назва події"
        placeholder="Текст"
        icon={<PenLine size={20} />}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <DateInput
          label="Дата завершення події"
          value={date}
          onChange={setDate}
          required
        />
        <p className="text-info">*-поля обов'язкові для вводу</p>
      </div>
      <div className="form-actions">
        <Button text="Назад" variant="ghost" onClick={() => navigate("/")} />

        {!onDelete ? (
          <Button
            text="Створити"
            icon={<Check size={20} />}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          />
        ) : (
          <Button
            text="Зберегти"
            icon={<Check size={20} />}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          />
        )}
      </div>
      {onDelete && (
        <div className="form-actions__delete">
          <Button
            text="Видалити"
            icon={<Trash size={18} />}
            variant="danger"
            onClick={onDelete}
          />
        </div>
      )}
    </div>
  );
};
