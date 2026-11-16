
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
    },

    educationItem: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 10,
        backgroundColor: colors.white,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },

    deleteButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: colors.background,
    },

    dateContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
    },
});
