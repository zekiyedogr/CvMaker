import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 24,
    },

    item: {
        width: '100%',
        flexDirection: 'column',
        gap: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderTopWidth: 2,
        borderTopColor: colors.primaryPurple,
        backgroundColor: colors.white,
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    title: {
        color: colors.main,
        fontSize: 16,
        fontWeight: '600',
    },

    fields: {
        width: '100%',
        flexDirection: 'column',
        gap: 18,
    },

    addButton: {
        alignSelf: 'flex-start',
    },
});