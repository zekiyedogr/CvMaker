import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    inputContainer: {
        flex: 1,
        minWidth: 0,
    },

    input: {
        width: '100%',
        paddingVertical: 7,
        paddingHorizontal: 2,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightPurple,
        borderRadius: 0,
        backgroundColor: 'transparent',
        color: colors.darkGray,
        fontSize: 14,
    },

    focused: {
        borderBottomColor: colors.secondary,
    },

    placeholder: {
        color: colors.gray,
    },

    deleteContainer: {
        width: 40,
        height: 40,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});