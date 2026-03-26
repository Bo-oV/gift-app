import confetti from "canvas-confetti";
import { GoogleIcon } from "../icons/GoogleIcon";
import "../Button/googleButton.scss";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export const GoogleButton = ({ onClick, disabled }: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    confetti({
      particleCount: 60,
      spread: 60,
      origin: {
        x: rect.left / window.innerWidth,
        y: rect.top / window.innerHeight,
      },
    });

    onClick();
  };

  return (
    <button className="google-btn" onClick={handleClick} disabled={disabled}>
      <GoogleIcon />
      <span>Продовжити з Google</span>
    </button>
  );
};
