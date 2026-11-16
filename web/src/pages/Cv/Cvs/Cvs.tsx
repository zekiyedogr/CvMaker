import { useEffect, useState } from 'react';
import './Cvs.css';

import Sidebar from '../../../components/Sidebar/Sidebar';
import CvCard from '../../../components/CvCard/CvCard';

import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface Cv {
    Id: number;
    CvName: string;
    FirstName: string;
    LastName: string;
    ThumbnailUrl: string | null;
}

const Cvs = () => {
    const { token } = useAuth();

    const [cvs, setCvs] = useState<Cv[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await api.get('/cvs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCvs(response.data.data);

            } catch (error) {
                console.error('CVs could not be retrieved:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCvs();
    }, [token]);

    const handleDeleteCv = async (id: number) => {
        try {
            await api.delete(`/cvs/${id}`);

            setCvs(prevCvs => prevCvs.filter(cv => cv.Id !== id));

        } catch (error) {
            console.error('CV deletion error:', error);
            alert('CV could not be deleted.');
        }
    };

    console.log(cvs)

    return (
        <div className="cvs-page">
            <Sidebar />

            <main className="cvs-content">
                <div className="cvs-header">
                    <h1>My CVs</h1>
                </div>

                <div className="cvs-list">
                    {loading ? (
                        <p>CVs are loading...</p>
                    ) : cvs.length > 0 ? (
                        cvs.map((cv) => (
                            <CvCard
                                key={cv.Id}
                                id={cv.Id}
                                cvName={cv.CvName}
                                firstName={cv.FirstName}
                                lastName={cv.LastName}
                                thumbnailUrl={cv.ThumbnailUrl}
                                onDelete={handleDeleteCv}
                            />
                        ))
                    ) : (
                        <p>You have not created a CV yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cvs;
