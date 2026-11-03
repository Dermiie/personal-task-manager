import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { formatDate, fromDateOnly, toDateOnly } from '../utils/FormatDate';

interface DatePickerProps {
  value?: string; // "YYYY-MM-DD"
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
}

function DatePicker({ value, onChange, onBlur }: DatePickerProps) {
  const selected = fromDateOnly(value);

  return (
    <DayPicker
      disabled={{ before: new Date() }}
      className="px-4"
      animate
      mode="single"
      selected={selected}
      onSelect={(date) => {
        onChange(date ? toDateOnly(date) : undefined);
        onBlur?.();
      }}
      footer={selected ? `Selected: ${formatDate(selected)}` : 'Pick a day.'}
    />
  );
}

export default DatePicker;
