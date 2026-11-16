
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import styles from './AddButton.styles';

interface AddButtonProps {
    onPress: () => void;
    label?: string;
    disabled?: boolean;
}

const AddButton = ({
    onPress,
    label = 'Add',
    disabled = false
}: AddButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Icon name="plus" size={16} color={styles.icon.color} />
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
};

export default AddButton;
