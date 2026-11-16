import { FiChevronLeft, FiChevronRight, FiEdit2, FiX } from 'react-icons/fi';
import './IconButton.css';

interface IconButtonProps {
    icon: 'left' | 'right' | 'edit' | 'close';
    onClick: () => void;
    disabled?: boolean;
    title?: string;
}

const IconButton = ({
    icon,
    onClick,
    disabled = false,
    title,
}: IconButtonProps) => {
    
    const icons = {
        left: <FiChevronLeft />,
        right: <FiChevronRight />,
        edit: <FiEdit2 />,
        close: <FiX />,
    };

    return (
        <button
            type="button"
            className="icon-button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={title || icon}
        >
            {icons[icon]}
        </button>
    );
};

export default IconButton;
