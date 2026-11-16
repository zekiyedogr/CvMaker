
import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';
import styles from './DatePicker.styles';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    min?: string;
    max?: string;
}

const DatePicker = ({
    label,
    value,
    onChange,
    disabled = false,
    required = false,
    min,
    max,
}: DatePickerProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [focused, setFocused] = useState(false);

    const parseDate = (date: string) => {
        const [year, month, day] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const selectedDate = value
        ? parseDate(value)
        : new Date();

    const handleDateChange = (_event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
            setFocused(false);
        }

        if (date) {
            const formattedDate = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, '0'),
                String(date.getDate()).padStart(2, '0'),
            ].join('-');

            onChange(formattedDate);
        }
    };

    const handlePickerPress = () => {
        if (disabled) return;

        if (Platform.OS === 'ios' && showPicker) {
            setShowPicker(false);
            setFocused(false);
            return;
        }

        setFocused(true);
        setShowPicker(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && (
                    <Text style={styles.required}> *</Text>
                )}
            </Text>

            <TouchableOpacity
                style={[
                    styles.input,
                    focused && styles.focused,
                    disabled && styles.disabled,
                ]}
                onPress={handlePickerPress}
                activeOpacity={1}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.value,
                        !value && styles.placeholder,
                    ]}
                >
                    {value || 'Select date'}
                </Text>

                <Icon
                    name="calendar"
                    size={20}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    minimumDate={min ? parseDate(min) : undefined}
                    maximumDate={max ? parseDate(max) : undefined}
                    onChange={handleDateChange}
                    accentColor={colors.main}
                />
            )}
        </View>
    );
};

export default DatePicker;
