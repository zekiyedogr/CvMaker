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
        color: colors.main,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },

    focused: {
        borderColor: colors.lightPurple,
        borderWidth: 1,
        shadowColor: colors.inputFocusBackground,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            elevation: 4,
    },

    placeholder: {
        color: colors.gray,
    },

    disabled: {
        backgroundColor: colors.lightGray,
        opacity: 0.7,
    },
});