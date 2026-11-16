
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        padding: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 14,
        width: '100%',
    },

    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },

    profileImage: {
        width: 65,
        height: 65,
        flexShrink: 0,
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },

    placeholder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: '#EDE9FE',
        alignItems: 'center',
        justifyContent: 'center',
    },

    placeholderText: {
        color: colors.main,
        fontSize: 21,
        fontWeight: '600',
    },

    profileDetails: {
        flex: 1,
    },

    name: {
        marginBottom: 7,
        color: colors.secondary,
        fontSize: 17,
        fontWeight: '700',
    },

    profession: {
        color: colors.gray,
        fontSize: 14,
    },

    buttons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
    },

    actionText: {
        color: colors.secondary,
        fontSize: 13,
        fontWeight: '600',
    },

    createCvButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        height: 42,
        backgroundColor: colors.secondary,
        borderRadius: 8,
    },

    createCvText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default styles;