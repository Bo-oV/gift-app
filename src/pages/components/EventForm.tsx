import { useState } from "react";

type Props = {
  initialTitle?: string;
  initialDate?: string;
  onSubmit: (title: string, date: string) => Promise<void>;
  titleText?: string;
  onDelete?: () => Promise<void>;
};

export const EventForm = ({
  initialTitle = "",
  initialDate = "",
  onSubmit,
  titleText = "Create Event",
  onDelete,
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  return (
    <div>
      <h1>{titleText ?? "Create Event"}</h1>
      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        Save
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          style={{ marginTop: "10px", background: "red", color: "white" }}
        >
          Delete Event
        </button>
      )}
    </div>
  );
};
