import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/Button/IconButton";
import { Link } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { SocialPostModal } from "./SocialPostModal";
import "../components/shareModal.scss";

type Props = {
  link: string;
  onClose: () => void;
  mode: "qr" | "link" | "post";
  title?: string;
  userName?: string;
  dateLabel?: string;
};

export const ShareModal = ({
  link,
  onClose,
  mode,
  title = "Назва події",
  userName = "Ім'я користувача",
  dateLabel = "Дата події",
}: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Посилання скопійовано");
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement | null;

    if (!canvas) {
      return;
    }

    const url = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "event-qr.png";
    anchor.click();
  };

  if (mode === "post") {
    return (
      <SocialPostModal
        title={title}
        userName={userName}
        dateLabel={dateLabel}
        link={link}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="confirm-modal">
      <div className="confirm-modal__backdrop" onClick={onClose} />

      <div className="confirm-modal__content">
        <h3 className="confirm-modal__title">
          {mode === "qr" ? "QR код" : "Посилання"}
        </h3>

        {mode === "qr" && (
          <div className="confirm-modal__qr">
            <QRCodeCanvas value={link} size={180} id="qr-code" />
          </div>
        )}

        {mode === "link" && (
          <div className="confirm-modal__row">
            <input className="confirm-modal__link" value={link} readOnly />

            <IconButton
              icon={<Link size={16} />}
              onClick={handleCopy}
              ariaLabel="Copy link"
            />
          </div>
        )}

        <div className="confirm-modal__actions-row">
          <Button text="Закрити" variant="ghost" onClick={onClose} />

          {mode === "qr" && (
            <Button text="Завантажити QR" onClick={handleDownload} />
          )}

          {mode === "link" && (
            <Button text="Скопіювати" onClick={handleCopy} />
          )}
        </div>
      </div>
    </div>
  );
};
