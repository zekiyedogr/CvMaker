
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
    },

    experienceItem: {
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
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },

    fields: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
    },

    dateContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
    },

    responsibilities: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    },

    responsibilitiesLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.main,
    },
});
