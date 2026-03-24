import "./iconButton.scss";
import type { ReactNode } from "react";

type IconButtonProps = {
  icon: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  disabled?: boolean;
};

export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  disabled,
}: IconButtonProps) => {
  return (
    <button
      className="icon-button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};
