
import './TextArea.css';

interface TextAreaProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    required?: boolean;
}

const TextArea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    rows = 4,
    disabled = false,
    required = false
}: TextAreaProps) => {
    return (
        <div className="text-area">
            <label htmlFor={name}>{label}</label>

            <textarea
                id={name}
                name={name}
                value={value}
                placeholder={placeholder || `Enter ${label}`}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                disabled={disabled}
                required={required}
            />
        </div>
    );
};

export default TextArea;
