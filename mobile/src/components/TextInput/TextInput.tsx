import { useState } from 'react';
import React from 'react';
import { View, Text, TextInput as RNTextInput } from 'react-native';
import styles from './TextInput.styles';

interface TextInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    disabled?: boolean;
    required?: boolean;
}

const TextInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false
}: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.container}>
            <RNTextInput
                nativeID={name}
                value={value}
                placeholder={placeholder || `Enter ${label}`}
                onChangeText={onChange}
                editable={!disabled}
                secureTextEntry={type === 'password'}
                keyboardType={
                    type === 'email'
                        ? 'email-address'
                        : type === 'number'
                            ? 'numeric'
                            : 'default'
                }
                style={[
                    styles.input,
                    isFocused && styles.focused,
                    disabled && styles.disabled,
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor={styles.placeholder.color}
            />
        </View>
    );
};

export default TextInput;