
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        padding: 25,
    },

    container: {
        width: '100%',
        maxWidth: 400,
        padding: 25,
        backgroundColor: colors.white,
        borderRadius: 14,
        gap: 18,
    },

    title: {
        color: colors.secondary,
        fontSize: 19,
        fontWeight: '700',
        textAlign: 'center',
    },

    errorTitle: {
        color: colors.red,
    },

    message: {
        color: colors.darkGray,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },

    buttonWrapper: {
        flex: 1,
    },
});

export default styles;
