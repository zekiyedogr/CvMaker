import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    container: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },

    panel: {
        width: '100%',
        maxWidth: 620,
        alignSelf: 'center',
        backgroundColor: colors.panelBackground,
        borderWidth: 1,
        borderColor: colors.panelBorder,
        borderRadius: 32,
        padding: 24,
    },

    header: {
        alignItems: 'center',
        marginBottom: 24,
    },

    logo: {
        width: 240,
        height: 110,
        marginBottom: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 16,
    },

    subtitle: {
        fontSize: 14,
        color: colors.darkGray,
        textAlign: 'center',
        lineHeight: 21,
    },

    form: {
        width: '100%',
        gap: 18,
    },

    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -5,
        marginBottom: 2,
    },

    linkText: {
        color: colors.secondary,
        fontSize: 14,
        fontWeight: '600',
    },

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },

    registerText: {
        color: colors.white,
        fontSize: 13,
    },

    registerLink: {
        color: colors.lightPurple,
        fontSize: 13,
        fontWeight: '700',
    },

    backgroundImage: {
        ...StyleSheet.absoluteFill,
    },
});

export default styles;