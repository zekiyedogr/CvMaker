
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import api from '../../../services/api';
import colors from '../../../constants/colors';

import CvCard from '../../../components/CvCard/CvCard';
import MessageModal from '../../../components/MessageModal/MessageModal';
import BaseButton from '../../../components/BaseButton/BaseButton';

import styles from './Cvs.styles';

interface Cv {
    Id: number;
    CvName: string;
    FirstName: string;
    LastName: string;
    ThumbnailUrl: string | null;
}

const Cvs = () => {
    const navigation = useNavigation<any>();

    const [cvs, setCvs] = useState<Cv[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [selectedCvId, setSelectedCvId] = useState<number | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'message' | 'error' | 'confirm'>('message');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const showMessage = (
        title: string,
        message: string,
        type: 'message' | 'error' | 'confirm' = 'message'
    ) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setModalVisible(true);
    };

    const fetchCvs = async () => {
        try {
            const response = await api.get('/cvs');
            setCvs(response.data.data);
        } catch (error) {
            console.error('CVs could not be retrieved:', error);

            showMessage(
                'Error',
                'CVs could not be loaded.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCvs();
        }, [])
    );

    const handleDeleteRequest = (id: number) => {
        setSelectedCvId(id);

        showMessage(
            'Delete CV',
            'Are you sure you want to delete this CV?',
            'confirm'
        );
    };

    const handleDeleteCv = async () => {
        if (selectedCvId === null) return;

        try {
            setDeleting(true);

            await api.delete(`/cvs/${selectedCvId}`);

            setCvs(prevCvs =>
                prevCvs.filter(cv => cv.Id !== selectedCvId)
            );

            setModalVisible(false);
            setSelectedCvId(null);
        } catch (error) {
            console.error('CV deletion error:', error);

            setModalVisible(false);

            showMessage(
                'Error',
                'CV could not be deleted.',
                'error'
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleCreateCv = () => {
        // Profil seçimi ekranının route adını kendi navigator yapına göre bağlayacağız.
        navigation.navigate('Profiles');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>My CVs</Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={colors.secondary}
                        />
                        <Text style={styles.loadingText}>
                            CVs are loading...
                        </Text>
                    </View>
                ) : cvs.length > 0 ? (
                    <View style={styles.cvList}>
                        {cvs.map(cv => (
                            <View
                                key={cv.Id}
                                style={styles.cardWrapper}
                            >
                                <CvCard
                                    id={cv.Id}
                                    cvName={cv.CvName}
                                    firstName={cv.FirstName}
                                    lastName={cv.LastName}
                                    thumbnailUrl={cv.ThumbnailUrl}
                                    onDelete={handleDeleteRequest}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>
                            You have not created a CV yet.
                        </Text>

                        <Text style={styles.emptyText}>
                            Create your first CV to get started.
                        </Text>
                    </View>
                )}
            </ScrollView>

            <MessageModal
                visible={modalVisible}
                type={modalType}
                title={modalTitle}
                message={deleting ? 'Deleting CV...' : modalMessage}
                onClose={() => {
                    if (!deleting) {
                        setModalVisible(false);
                        setSelectedCvId(null);
                    }
                }}
                onConfirm={handleDeleteCv}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </View>
    );
};

export default Cvs;
