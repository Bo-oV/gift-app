import "./textarea.scss";

type Props = {
  label: string;
  placeholder?: string;
  max?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Textarea = ({
  label,
  placeholder,
  max = 100,
  value,
  onChange,
}: Props) => {
  return (
    <div className="textarea">
      <label className="textarea__label">{label}</label>

      <textarea
        className="textarea__control"
        placeholder={placeholder}
        onChange={onChange}
        maxLength={max}
      />

      <span className="textarea__counter">
        {value.length}/{max} символів
      </span>
    </div>
  );
};
