import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';
import styles from './Checkbox.styles';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const Checkbox = ({
    label,
    checked,
    onChange,
    disabled = false,
}: CheckboxProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => !disabled && onChange(!checked)}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.checkbox,
                    checked && styles.checked,
                    disabled && styles.disabled,
                ]}
            >
                {checked && (
                    <Icon
                        name="check"
                        size={13}
                        color={colors.white}
                    />
                )}
            </View>

            <Text
                style={[
                    styles.label,
                    disabled && styles.disabledLabel,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default Checkbox;