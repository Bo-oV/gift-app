import "../Button/button.scss";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Color = "default" | "dark";

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
  color?: Color;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button = ({
  text,
  icon,
  variant = "secondary",
  color = "default",
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant} button--${color}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="button__icon">{icon}</span>}

      <span className="button__text">{text}</span>
    </button>
  );
};
