
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flexDirection: 'column',
        padding: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 14,
        marginBottom: 18,
    },

    cardContent: {
        width: '100%',
        alignItems: 'center',
    },

    imageContainer: {
        width: '100%',
        aspectRatio: 1 / 1.414,
        overflow: 'hidden',
        borderRadius: 6,
        backgroundColor: colors.lightGray,
    },

    thumbnail: {
        width: '100%',
        height: '100%',
    },

    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
    },

    placeholderText: {
        fontSize: 48,
        fontWeight: '600',
        color: colors.secondary,
    },

    info: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },

    cvName: {
        color: colors.secondary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },

    profileName: {
        color: colors.gray,
        fontSize: 14,
    },

    actions: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },
});

export default styles;
