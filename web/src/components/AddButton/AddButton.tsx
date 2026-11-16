
import { FiPlus } from 'react-icons/fi';
import './AddButton.css';

interface AddButtonProps {
    onClick: () => void;
    label?: string;
    disabled?: boolean;
}

const AddButton = ({
    onClick,
    label = 'Add',
    disabled = false
}: AddButtonProps) => {
    return (
        <button
            type="button"
            className="add-button"
            onClick={onClick}
            disabled={disabled}
        >
            <FiPlus />
            <span>{label}</span>
        </button>
    );
};

export default AddButton;
