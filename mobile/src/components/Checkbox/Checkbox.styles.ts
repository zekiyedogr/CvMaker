import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 10,
    },

    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1.5,
        borderColor: colors.gray,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },

    checked: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },

    label: {
        fontSize: 14,
        color: colors.main,
    },

    disabled: {
        opacity: 0.5,
    },

    disabledLabel: {
        opacity: 0.5,
    },
});