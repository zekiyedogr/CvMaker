
import React from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import styles from './BaseButton.styles'

interface BaseButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const BaseButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
}: BaseButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={styles.loader.color} />
      ) : (
        <Text style={styles.buttonText}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default BaseButton;
