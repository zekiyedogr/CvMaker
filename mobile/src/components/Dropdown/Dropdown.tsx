import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Modal,
    FlatList,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import styles from './Dropdown.styles';

export interface DropdownOption {
    label: string;
    value: string | number;
}

interface DropdownProps {
    label: string;
    name: string;
    value: string | number;
    options: DropdownOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

const Dropdown = ({
    label,
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    required = false,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(
        option => String(option.value) === String(value)
    );

    const handleSelect = (option: DropdownOption) => {
        onChange(String(option.value));
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            <Pressable
                style={[
                    styles.trigger,
                    isOpen && styles.triggerActive,
                    disabled && styles.disabled,
                ]}
                onPress={() => setIsOpen(true)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.triggerText,
                        !selectedOption && styles.placeholder,
                    ]}
                    numberOfLines={1}
                >
                    {selectedOption?.label || placeholder}
                </Text>

                <Icon
                    name="chevron-down"
                    size={18}
                    style={[
                        styles.dropdownIcon,
                        isOpen && styles.dropdownIconRotated,
                    ]}
                />
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setIsOpen(false)}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={event => event.stopPropagation()}
                    >
                        <FlatList
                            data={options}
                            keyExtractor={item => String(item.value)}
                            showsVerticalScrollIndicator={false}
                            style={styles.list}
                            ListEmptyComponent={
                                <Text style={styles.empty}>
                                    No options available
                                </Text>
                            }
                            renderItem={({ item }) => {
                                const isSelected =
                                    String(item.value) === String(value);

                                return (
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.option,
                                            pressed && styles.optionPressed,
                                            isSelected && styles.selectedOption,
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                isSelected && styles.selectedText,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>

                                        {isSelected && (
                                            <Icon
                                                name="check"
                                                size={16}
                                                style={styles.checkIcon}
                                            />
                                        )}
                                    </Pressable>
                                );
                            }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default Dropdown;
