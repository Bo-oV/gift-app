import "../Button/button.scss";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

/*
primary → gradient кнопка
secondary → звичайна кнопка
danger → delete кнопка
ghost → текстова кнопка 
*/

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  variant?: Variant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button = ({
  text,
  icon,
  variant = "secondary",
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant} `}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="button__icon">{icon}</span>}

      <span className={`button__text button__text--${variant}`}>{text}</span>
    </button>
  );
};
