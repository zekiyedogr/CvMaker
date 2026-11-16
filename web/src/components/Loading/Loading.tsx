import './Loading.css';

interface LoadingProps {
    message?: string;
}

const Loading = ({ message = 'PDF is being prepared...' }: LoadingProps) => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <p>{message}</p>
                <span>Please wait; this process may take some time.</span>
            </div>
        </div>
    );
};

export default Loading;