
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.secondary,
        borderRadius: 8,
        backgroundColor: colors.primaryPurple,
    },
    text: {
        color: colors.secondary,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    icon: {
        color: colors.secondary,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default styles;
