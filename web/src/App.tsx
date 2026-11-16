import { useEffect, useState } from 'react';
import Router from './routes/Router';
import Toast from './components/Toast/Toast';

interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'warning';
}

function App() {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    useEffect(() => {
        const handleApiError = (event: Event) => {
            const customEvent = event as CustomEvent<string>;

            setToast({
                message: customEvent.detail,
                type: 'error'
            });
        };

        window.addEventListener('api-error', handleApiError);

        return () => {
            window.removeEventListener('api-error', handleApiError);
        };
    }, []);

    return (
        <>
            <Router />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

export default App;