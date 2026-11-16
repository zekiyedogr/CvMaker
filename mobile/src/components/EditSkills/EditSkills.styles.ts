
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 28,
    },

    category: {
        width: '100%',
        flexDirection: 'column',
        gap: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 12,
        backgroundColor: colors.white,
    },

    categoryHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },

    titleInput: {
        flex: 1,
        minWidth: 0,
    },

    items: {
        width: '100%',
        flexDirection: 'column',
        gap: 18,
        paddingTop: 16,
        borderTopWidth: 2,
        borderTopColor: colors.primaryPurple,
    },

    itemRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },

    itemInput: {
        flex: 1,
        minWidth: 0,
    },

    addItem: {
        alignSelf: 'flex-start',
    },

    addCategory: {
        alignSelf: 'flex-start',
    },
});
