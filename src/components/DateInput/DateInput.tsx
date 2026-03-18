import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./dateinput.scss";

import { Calendar, ChevronDown } from "lucide-react";
import { Input } from "../Input/Input";

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
};

export const DateInput = ({ label, value, onChange, required }: Props) => {
  return (
    <DatePicker
      selected={value}
      onChange={(date: Date | null) => onChange(date)}
      dateFormat="dd.MM.yyyy"
      placeholderText="Оберіть дату"
      shouldCloseOnSelect
      showPopperArrow={false}
      wrapperClassName="date-picker"
      calendarClassName="date-picker__calendar"
      popperClassName="date-picker__popper"
      customInput={
        <Input
          label={`${required ? "* " : ""}${label}`}
          icon={<Calendar size={20} />}
          rightIcon={<ChevronDown size={20} />}
        />
      }
    />
  );
};
