import { Button } from "@/components/Button/Button";
import "../components/shareModal.scss";
import { QRCodeCanvas } from "qrcode.react";
import { IconButton } from "@/components/Button/IconButton";
import { Link } from "lucide-react";
import toast from "react-hot-toast";
type Props = {
  link: string;
  onClose: () => void;

  // [ADDED]
  mode: "qr" | "link" | "post";
};

export const ShareModal = ({ link, onClose, mode }: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Посилання скопійовано 🔗");
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "event-qr.png";
    a.click();
  };

  return (
    <div className="confirm-modal">
      <div className="confirm-modal__backdrop" onClick={onClose} />

      <div className="confirm-modal__content">
        {/* TITLE */}
        <h3 className="confirm-modal__title">
          {mode === "qr" && "QR код"}
          {mode === "link" && "Посилання"}
          {mode === "post" && "Пост для соц мереж"}
        </h3>

        {/* QR MODE */}
        {mode === "qr" && (
          <div className="confirm-modal__qr">
            <QRCodeCanvas value={link} size={180} id="qr-code" />
          </div>
        )}

        {/* LINK MODE */}
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

        {/* POST MODE (поки заглушка) */}
        {mode === "post" && (
          <div style={{ textAlign: "center" }}>
            <p>Скоро буде 🔥</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="confirm-modal__actions-row">
          <Button text="Закрити" variant="ghost" onClick={onClose} />

          {mode === "qr" && (
            <Button text="Завантажити QR" onClick={handleDownload} />
          )}

          {mode === "link" && <Button text="Скопіювати" onClick={handleCopy} />}
        </div>
      </div>
    </div>
  );
};
