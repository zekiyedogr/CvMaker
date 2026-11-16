import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import api from '../../services/api';
import styles from './ProfileCard.styles';

interface ProfileCardProps {
  id: number;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  profession: string | null;
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
  onCopy: (id: number) => void;
  onCreateCv: (id: number) => void;
}

const ProfileCard = ({
  id,
  photoUrl,
  firstName,
  lastName,
  profession,
  onDelete,
  onPress,
  onCopy,
  onCreateCv,
}: ProfileCardProps) => {

    const serverUrl = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

    const imageUri = photoUrl
        ? photoUrl.startsWith('http')
        ? photoUrl
        : `${serverUrl}${photoUrl}`
        : null;

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.profileInfo}
        onPress={() => onPress(id)}
      >
        <View style={styles.profileImage}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>

          <Text style={styles.profession}>
            {profession || 'Profession not specified'}
          </Text>
        </View>
      </Pressable>

      <View style={styles.buttons}>
        <AddButton label="Copy" onPress={() => onCopy(id)}/>
        <DeleteButton onPress={() => onDelete(id)} />
      <AddButton label="Create CV" onPress={() => onCreateCv(id)} />
      </View>
    </View>
  );
};

export default ProfileCard;
