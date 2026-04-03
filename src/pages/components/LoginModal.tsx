import { X } from "lucide-react";
import "../components/logicModal.scss";
import { GoogleButton } from "@/components/Button/GoogleButton";

type Props = {
  title?: string;
  onClose: () => void;
  onSuccess: () => void;
};

export const LoginModal = ({ title = "Увійди", onClose }: Props) => {
  return (
    <div className="login-modal">
      <div className="login-modal__backdrop" onClick={onClose} />

      <div className="login-modal__content">
        <button className="modal-overlay__close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="login-modal__header">
          <h3>{title}</h3>
        </div>

        {/* BODY */}
        <div className="login-modal__body">
          <p className="login-modal__subtitle">Це займе лише 2 секунди</p>

          <GoogleButton
            onClick={async () => {
              const { signInWithGoogle } = await import("../../firebase/auth");

              await signInWithGoogle();
            }}
          />
        </div>
      </div>
    </div>
  );
};
