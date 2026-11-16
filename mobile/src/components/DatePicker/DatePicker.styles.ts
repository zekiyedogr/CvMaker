import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 8,
        minWidth: 0,
        width: '100%',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.main,
        textAlign: 'left',
    },

    input: {
        width: '100%',
        height: 44,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.background,
        borderRadius: 8,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    focused: {
        borderColor: colors.lightPurple,
        backgroundColor: colors.inputFocusBackground,
    },

    value: {
        color: colors.main,
        fontSize: 14,
    },

    placeholder: {
        color: colors.gray,
    },

    disabled: {
        backgroundColor: colors.lightGray,
        opacity: 0.7,
    },

    required: {
        color: colors.red,
    },
});