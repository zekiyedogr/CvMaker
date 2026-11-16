import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../../services/api';
import colors from '../../../constants/colors';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AddButton from '../../../components/AddButton/AddButton';
import MessageModal from '../../../components/MessageModal/MessageModal';
import styles from './Profiles.styles';

interface Profile {
    Id: number;
    Name: string;
    PhotoUrl: string | null;
    FirstName: string;
    LastName: string;
    Profession: string | null;
}

const Profiles = () => {
    const navigation = useNavigation<any>();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'message' | 'error' | 'confirm'>('message');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

    const fetchProfiles = async () => {
        try {
            setLoading(true);

            const response = await api.get('/profiles');

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

    useFocusEffect(
        useCallback(() => {
            fetchProfiles();
        }, [])
    );

    const handleDelete = (id: number) => {
        const profile = profiles.find(item => item.Id === id);

        if (!profile) return;

        setSelectedProfileId(id);
        setModalType('confirm');
        setModalTitle('Delete Profile');
        setModalMessage(
            `${profile.FirstName} ${profile.LastName} profilini silmek istediğine emin misin?`
        );
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (selectedProfileId === null) return;

        try {
            await api.delete(`/profiles/${selectedProfileId}`);

            setProfiles(prev =>
                prev.filter(profile => profile.Id !== selectedProfileId)
            );

            setModalType('message');
            setModalTitle('Success');
            setModalMessage('Profile deleted successfully.');

        } catch (error: any) {
            console.error(
                'Profile deletion error:',
                error.response?.data || error.message
            );

            setModalType('error');
            setModalTitle('Error');
            setModalMessage(
                error.response?.data?.message ||
                'Profile could not be deleted.'
            );

        } finally {
            setSelectedProfileId(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Profiles</Text>

                <AddButton
                    label="Add Profile"
                    onPress={() => navigation.navigate('AddProfile')}
                />
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={colors.secondary}
                    style={styles.loader}
                />
            ) : profiles.length > 0 ? (
                <FlatList
                    data={profiles}
                    keyExtractor={item => item.Id.toString()}
                    renderItem={({ item }) => (
                        <ProfileCard
                            id={item.Id}
                            photoUrl={item.PhotoUrl}
                            firstName={item.FirstName}
                            lastName={item.LastName}
                            profession={item.Profession}
                            onDelete={handleDelete}
                            onPress={() => navigation.navigate('EditProfile', {
                                profileId: item.Id
                            })}
                            onCopy={() => navigation.navigate('AddProfile', {
                                copyFrom: item.Id
                            })}
                            onCreateCv={ () => 
                                {
                                    navigation.navigate('CreateCv', {
                                        profileId: item.Id,
                                    });
                                }
                            }
                        />
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.emptyText}>
                    You have not created a profile yet.
                </Text>
            )}

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
        </View>
    );
};

export default Profiles;
