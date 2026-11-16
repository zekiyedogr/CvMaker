
import { useEffect, useState } from 'react';
import './Profiles.css';

import Sidebar from '../../../components/Sidebar/Sidebar';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AddButton from '../../../components/AddButton/AddButton';
import MessageModal from '../../../components/MessageModal/MessageModal';

import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
    Id: number;
    Name: string;
    PhotoUrl: string | null;
    FirstName: string;
    LastName: string;
    Profession: string | null;
}

const Profiles = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'message' | 'error' | 'confirm'>('message');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await api.get('/profiles', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setProfiles(response.data.data);

            } catch (error) {
                console.error('Profiles could not be retrieved:', error);

                setModalType('error');
                setModalTitle('Error');
                setModalMessage('Profiles could not be retrieved.');
                setModalVisible(true);

            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [token]);

    // Silme onayı
    const handleDelete = (id: number) => {
        const profile = profiles.find(item => item.Id === id);

        if (!profile) return;

        setSelectedProfileId(id);
        setModalType('confirm');
        setModalTitle('Delete Profile');
        setModalMessage(
            `Are you sure you want to delete ${profile.FirstName} ${profile.LastName}'s profile?`
        );
        setModalVisible(true);
    };

    // Silme işlemi
    const confirmDelete = async () => {
        if (selectedProfileId === null) return;

        try {
            await api.delete(`/profiles/${selectedProfileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfiles(prevProfiles =>
                prevProfiles.filter(profile => profile.Id !== selectedProfileId)
            );

            setModalType('message');
            setModalTitle('Success');
            setModalMessage('Profile deleted successfully.');
            setModalVisible(true);

        } catch (error: any) {
            console.error('Profile deletion error:', error.response?.data || error.message);

            setModalType('error');
            setModalTitle('Error');
            setModalMessage(
                error.response?.data?.message || 'Profile could not be deleted.'
            );
            setModalVisible(true);

        } finally {
            setSelectedProfileId(null);
        }
    };

    return (
        <div className="profiles-page">
            <Sidebar />

            <main className="profiles-content">
                <div className="profiles-header">
                    <h1>My Profiles</h1>

                    <AddButton
                        label="Add Profile"
                        onClick={() => navigate('/profiles/add-profile')}
                    />
                </div>

                <div className="profiles-list">
                    {loading ? (
                        <p>Profiles are loading...</p>
                    ) : profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileCard
                                key={profile.Id}
                                id={profile.Id}
                                photoUrl={profile.PhotoUrl}
                                firstName={profile.FirstName}
                                lastName={profile.LastName}
                                profession={profile.Profession}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p>You have not created a profile yet.</p>
                    )}
                </div>
            </main>

            <MessageModal
                visible={modalVisible}
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedProfileId(null);
                }}
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default Profiles;
