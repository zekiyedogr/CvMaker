
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 24,
    },

    projectItem: {
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
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
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

    descriptions: {
        width: '100%',
        flexDirection: 'column',
        gap: 10,
    },

    descriptionsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.main,
    },
});
