import { Pencil, Calendar, Trash2 } from "lucide-react";
import "./eventActionsSheet.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onAddToCalendar: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
};

export const EventActionsSheet = ({
  open,
  onClose,
  onEdit,
  onAddToCalendar,
  onDelete,
  isOwner,
}: Props) => {
  if (!open) return null;

  return (
    <div className="actions-sheet">
      {/* backdrop */}
      <div className="actions-sheet__backdrop" onClick={onClose} />

      {/* content */}
      <div className="actions-sheet__content">
        {/* drag indicator */}
        <div className="actions-sheet__handle" />

        {/* EDIT (тільки для owner) */}
        {isOwner && onEdit && (
          <button
            className="actions-sheet__item"
            onClick={() => {
              onEdit();
              onClose();
            }}
          >
            <Pencil size={18} />
            <span>Редагувати</span>
          </button>
        )}

        {/* CALENDAR */}
        <button
          className="actions-sheet__item"
          onClick={() => {
            onAddToCalendar();
            onClose();
          }}
        >
          <Calendar size={18} />
          <span>Додати в календар</span>
        </button>

        {/* DELETE (тільки для owner) */}
        {isOwner && onDelete && (
          <button
            className="actions-sheet__item actions-sheet__item--danger"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 size={18} />
            <span>Видалити подію</span>
          </button>
        )}
      </div>
    </div>
  );
};
