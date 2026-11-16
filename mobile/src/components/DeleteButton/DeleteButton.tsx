import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import styles from './DeleteButton.styles';
import colors from '../../constants/colors';

interface DeleteButtonProps {
    onPress: () => void;
    label?: string;
    iconOnly?: boolean;
    disabled?: boolean;
    title?: string;
}

const DeleteButton = ({
    onPress,
    label = 'Delete',
    iconOnly = false,
    disabled = false,
}: DeleteButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                iconOnly && styles.iconOnly,
                disabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Icon
                name="trash-2"
                size={18}
                color={colors.red}
            />

            {!iconOnly && (
                <Text style={styles.text}>{label}</Text>
            )}
        </TouchableOpacity>
    );
};

export default DeleteButton;