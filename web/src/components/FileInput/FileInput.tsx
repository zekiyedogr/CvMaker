
import './FileInput.css';

interface FileInputProps {
    label: string;
    name: string;
    accept?: string;
    onChange: (file: File | null) => void;
    disabled?: boolean;
}

const FileInput = ({
    label,
    name,
    accept,
    onChange,
    disabled = false
}: FileInputProps) => {
    return (
        <div className="file-input">
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                name={name}
                type="file"
                accept={accept}
                disabled={disabled}
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    onChange(file);
                }}
            />
        </div>
    );
};

export default FileInput;
