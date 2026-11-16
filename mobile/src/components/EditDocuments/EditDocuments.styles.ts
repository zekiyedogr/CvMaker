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
        gap: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 10,
        backgroundColor: colors.white,
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
    },

    fields: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
    },
});