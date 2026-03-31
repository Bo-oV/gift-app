import { QrCode } from "lucide-react";
import "./eventActionsSheet.scss";
import { Files } from "lucide-react";
import { FileImage } from "lucide-react";
import { Pencil } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { Trash } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onAddToCalendar?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;

  onGenerateQR?: () => void;
  onCopyLink?: () => void;
  onSocialPost?: () => void;
};

export const EventActionsSheet = ({
  open,
  onClose,
  onEdit,
  onAddToCalendar,
  onDelete,
  isOwner,
  onGenerateQR,
  onCopyLink,
  onSocialPost,
}: Props) => {
  if (!open) return null;

  // [ADDED]
  const isShareMode = onGenerateQR || onCopyLink || onSocialPost;

  return (
    <div className="actions-sheet">
      <div className="actions-sheet__backdrop" onClick={onClose} />

      <div className="actions-sheet__content">
        <div className="actions-sheet__handle" />

        {/* [ADDED] SHARE ACTIONS */}
        {isShareMode && (
          <>
            <button
              className="actions-sheet__item"
              onClick={() => {
                onGenerateQR?.();
                onClose();
              }}
            >
              <QrCode size={16} />
              <span>Згенерувати QR</span>
            </button>

            <button
              className="actions-sheet__item"
              onClick={() => {
                onCopyLink?.();
                onClose();
              }}
            >
              <Files size={16} />
              <span>Скопіювати посилання</span>
            </button>

            <button
              className="actions-sheet__item"
              onClick={() => {
                onSocialPost?.();
                onClose();
              }}
            >
              <FileImage size={16} />
              <span>Пост для соц мереж</span>
            </button>
          </>
        )}

        {/* CHANGE*/}
        {!isShareMode && (
          <>
            {isOwner && onEdit && (
              <button
                className="actions-sheet__item"
                onClick={() => {
                  onEdit();
                  onClose();
                }}
              >
                <Pencil size={16} />
                <span>Редагувати</span>
              </button>
            )}

            {onAddToCalendar && (
              <button
                className="actions-sheet__item"
                onClick={() => {
                  onAddToCalendar();
                  onClose();
                }}
              >
                <CalendarCheck size={16} />
                <span>Додати в календар</span>
              </button>
            )}

            {isOwner && onDelete && (
              <button
                className="actions-sheet__item actions-sheet__item--danger"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                <Trash size={16} />
                <span>Видалити подію</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
