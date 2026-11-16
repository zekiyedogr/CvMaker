
import { FiTrash2 } from 'react-icons/fi';
import './DeleteButton.css';

interface DeleteButtonProps {
    onClick: () => void;
    label?: string;
    iconOnly?: boolean;
    disabled?: boolean;
    title?: string;
}

const DeleteButton = ({
    onClick,
    label = 'Delete',
    iconOnly = false,
    disabled = false,
    title = 'Delete'
}: DeleteButtonProps) => {
    return (
        <button
            type="button"
            className={`delete-button ${iconOnly ? 'icon-only' : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            <FiTrash2 />
            {!iconOnly && <span>{label}</span>}
        </button>
    );
};

export default DeleteButton;
