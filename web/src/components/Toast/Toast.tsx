import './Toast.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
};

export default Toast;