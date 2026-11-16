
import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 35,
    },

    header: {
        marginBottom: 25,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.secondary,
    },

    subtitle: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 5,
    },

    createButton: {
        marginBottom: 22,
    },

    cvList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    cardWrapper: {
        width: '48%',
    },

    loadingContainer: {
        minHeight: 250,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    loadingText: {
        fontSize: 14,
        color: colors.gray,
    },

    emptyContainer: {
        minHeight: 250,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },

    emptyTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
});

export default styles;
