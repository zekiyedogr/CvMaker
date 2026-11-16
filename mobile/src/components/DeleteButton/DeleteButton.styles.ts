

import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
    },
    text: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
    },
    icon: {
        color: '#DC2626',
    },
    iconOnly: {
        width: 36,
        height: 36,
        padding: 0,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default styles;
