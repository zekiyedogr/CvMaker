
import './MessageModal.css';

interface MessageModalProps {
    visible: boolean;
    type: 'message' | 'error' | 'confirm';
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const MessageModal = ({
    visible,
    type,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: MessageModalProps) => {

    if (!visible) return null;

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <div className="message-modal-overlay" onClick={onClose}>
            <div
                className="message-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={`message-modal-title ${
                    type === 'error' ? 'error-title' : ''
                }`}>
                    {title}
                </h2>

                <p className="message-modal-message">
                    {message}
                </p>

                <div className="message-modal-buttons">
                    {type === 'confirm' ? (
                        <>
                            <button
                                className="message-modal-button cancel-button"
                                onClick={onClose}
                            >
                                {cancelText}
                            </button>

                            <button
                                className="message-modal-button confirm-button"
                                onClick={handleConfirm}
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button
                            className="message-modal-button confirm-button"
                            onClick={onClose}
                        >
                            Tamam
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
