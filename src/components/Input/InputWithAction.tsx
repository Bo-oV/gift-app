import "../Input/InputWithAction.scss";
type Props = {
  label: string;
  placeholder?: string;
  actionText: string;
};

export const InputWithAction = ({ label, placeholder, actionText }: Props) => {
  return (
    <div className="input">
      <label className="input__label">{label}</label>

      <div className="input__field">
        <input className="input__control" placeholder={placeholder} />

        <button className="input__action">{actionText}</button>
      </div>
    </div>
  );
};
