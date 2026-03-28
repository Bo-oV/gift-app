import { Button } from "@/components/Button/Button";
import "../components/shareModal.scss";
import { QRCodeCanvas } from "qrcode.react";
import { IconButton } from "@/components/Button/IconButton";
import { Link } from "lucide-react";
import { X } from "lucide-react";
type Props = {
  link: string;
  onClose: () => void;
};

export const ShareModal = ({ link, onClose }: Props) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
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
        <h3 className="confirm-modal__title">Запроси друзів 🎉</h3>

        {/* QR */}
        <div className="confirm-modal__qr">
          <QRCodeCanvas value={link} size={160} id="qr-code" />
        </div>

        {/* LINK + COPY */}
        <div className="confirm-modal__row">
          <div className="confirm-modal__row">
            <input className="confirm-modal__link" value={link} readOnly />

            <IconButton
              icon={<Link size={16} />}
              onClick={handleCopy}
              ariaLabel="Copy link"
            />
          </div>
        </div>

        <div className="confirm-modal__actions-row">
          <Button text="Закрити" variant="ghost" onClick={onClose} />

          <Button text="Завантажити QR" onClick={handleDownload} />
        </div>
      </div>
    </div>
  );
};
