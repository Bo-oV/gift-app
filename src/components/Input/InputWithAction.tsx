import type { ReactNode } from "react";
import "../Input/inputWithAction.scss";

type Props = {
  icon?: ReactNode;
  label: string;
  placeholder?: string;
  actionText: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export const InputWithAction = ({
  icon,
  label,
  placeholder,
  actionText,
  value,
  onChange,
  error,
}: Props) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (!text) {
        alert("Буфер обміну порожній");
        return;
      }

      onChange(text);
    } catch {
      alert("Не вдалося отримати текст з буфера");
    }
  };

  return (
    <div className="input-action">
      <label className="input-action__label">{label}</label>

      <div
        className={`input-action__field ${
          error ? "input-action__field--error" : ""
        }`}
      >
        {icon && <span className="input-action__icon">{icon}</span>}

        <input
          className="input-action__control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="input-action__action"
          onClick={handlePaste}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};
