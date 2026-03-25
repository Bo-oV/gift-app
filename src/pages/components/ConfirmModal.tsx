import { Button } from "@/components/Button/Button";
import "../components/confirmModal.scss";
import { LogOut } from "lucide-react";

type Props = {
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title = "Підтвердження",
  text,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <div className="confirm-modal">
      <div className="confirm-modal__backdrop" onClick={onCancel} />

      <div className="confirm-modal__content">
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__text">{text}</p>

        <div className="confirm-modal__actions">
          <Button text={cancelText} variant="ghost" onClick={onCancel} />

          <Button
            icon={<LogOut size={12} />}
            text={confirmText}
            variant="secondary"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};
