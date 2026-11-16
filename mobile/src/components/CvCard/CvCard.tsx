
import React from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import DeleteButton from '../DeleteButton/DeleteButton';

import styles from './CvCard.styles';

interface CvCardProps {
    id: number;
    cvName: string;
    firstName: string;
    lastName: string;
    thumbnailUrl: string | null;
    onDelete: (id: number) => void;
}

const serverUrl = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

const CvCard: React.FC<CvCardProps> = ({
    id,
    cvName,
    firstName,
    lastName,
    thumbnailUrl,
    onDelete,
}) => {
    const navigation = useNavigation<any>();

    const handleClick = () => {
        navigation.navigate('EditCv', { cvId: id });
    };

    const imageUrl = thumbnailUrl
        ? `${serverUrl}${thumbnailUrl}`
        : null;

    return (
        <View style={styles.card}>
            <Pressable
                onPress={handleClick}
                style={styles.cardContent}
            >
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>
                                {firstName?.charAt(0)}
                                {lastName?.charAt(0)}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <Text
                        style={styles.cvName}
                        numberOfLines={1}
                    >
                        {cvName}
                    </Text>

                    <Text
                        style={styles.profileName}
                        numberOfLines={1}
                    >
                        {firstName} {lastName}
                    </Text>
                </View>
            </Pressable>

            <View style={styles.actions}>
                <DeleteButton
                    label="Delete"
                    onPress={() => onDelete(id)}
                />
            </View>
        </View>
    );
};

export default CvCard;
