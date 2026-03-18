import "../Input/input.scss";
import { forwardRef, type ReactNode } from "react";

type Props = {
  label: string;
  placeholder?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  error?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      placeholder,
      icon,
      rightIcon,
      error,
      type,
      value,
      onClick,
      onChange,
      required,
    },
    ref,
  ) => {
    return (
      <div className="input">
        <label className="input__label">
          {required ? "*" : ""}
          {label}
        </label>

        <div className={`input__field ${error ? "input__field--error" : ""}`}>
          {icon && <span className="input__icon">{icon}</span>}

          <input
            ref={ref}
            className="input__control"
            type={type ?? "text"}
            placeholder={placeholder}
            value={value}
            onClick={onClick}
            onChange={onChange}
          />

          {rightIcon && <span className="input__right-icon">{rightIcon}</span>}
        </div>
      </div>
    );
  },
);
