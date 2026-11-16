import './DatePicker.css';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    min?: string;
    max?: string;
}

const DatePicker = ({
    label,
    value,
    onChange,
    disabled = false,
    required = false,
    min,
    max
}: DatePickerProps) => {
    return (
        <div className="date-picker-container">
            <label className="date-picker-label">
                {label}
            </label>

            <input
                type="date"
                className="date-picker-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                min={min}
                max={max}
            />
        </div>
    );
};

export default DatePicker;
