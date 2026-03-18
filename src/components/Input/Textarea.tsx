import "./textarea.scss";

type Props = {
  label: string;
  placeholder?: string;
  max?: number;
};

export const Textarea = ({ label, placeholder, max = 100 }: Props) => {
  return (
    <div className="textarea">
      <label className="textarea__label">{label}</label>

      <textarea
        className="textarea__control"
        placeholder={placeholder}
        maxLength={max}
      />

      <span className="textarea__counter">0/{max} символів</span>
    </div>
  );
};
