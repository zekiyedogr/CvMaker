import './TextInput.css';

interface TextInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    disabled?: boolean;
    required?: boolean;
}

const TextInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
    required = false
}: TextInputProps) => {
    return (
        <div className="text-input">
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder || `Enter ${label}`}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
            />
        </div>
    );
};

export default TextInput;
