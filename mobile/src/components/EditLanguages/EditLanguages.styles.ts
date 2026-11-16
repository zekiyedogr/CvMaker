import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
    },

    item: {
        width: '100%',
        padding: 18,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 10,
        backgroundColor: colors.white,
        gap: 18,
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    fields: {
        width: '100%',
        flexDirection: 'column',
        gap: 18,
    },

    field: {
        width: '100%',
        minWidth: 0,
    },
});