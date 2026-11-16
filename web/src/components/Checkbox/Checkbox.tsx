
import './Checkbox.css';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const Checkbox = ({
    label,
    checked,
    onChange,
    disabled = false
}: CheckboxProps) => {
    return (
        <label className="checkbox-container">
            <input
                type="checkbox"
                className="checkbox-input"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />

            <span className="checkbox-label">
                {label}
            </span>
        </label>
    );
};

export default Checkbox;
