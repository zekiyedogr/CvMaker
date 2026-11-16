import React from 'react';
import {
    Pressable,
    StyleProp,
    ViewStyle,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import styles from './IconButton.styles';

interface IconButtonProps {
    icon: 'left' | 'right' | 'edit' | 'close' | 'plus' | 'minus';
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

const IconButton = ({
    icon,
    onPress,
    disabled = false,
    style,
}: IconButtonProps) => {

    const icons = {
        left: 'chevron-left',
        right: 'chevron-right',
        edit: 'edit-2',
        close: 'x',
        plus: 'plus',
        minus: 'minus',
    } as const;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Icon
                name={icons[icon]}
                size={19}
                color={disabled ? '#999999' : '#666666'}
            />
        </Pressable>
    );
};

export default IconButton;