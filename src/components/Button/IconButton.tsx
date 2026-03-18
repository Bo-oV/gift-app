import "./iconButton.scss";
import type { ReactNode } from "react";

type IconButtonProps = {
  icon: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
};

export const IconButton = ({ icon, onClick, ariaLabel }: IconButtonProps) => {
  return (
    <button className="icon-button" onClick={onClick} aria-label={ariaLabel}>
      {icon}
    </button>
  );
};
