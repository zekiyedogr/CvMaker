import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    button: {
        width: 38,
        height: 38,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
    },

    pressed: {
        backgroundColor: colors.background,
        borderColor: colors.lightGray,
    },

    disabled: {
        opacity: 0.4,
    },
});

export default styles;