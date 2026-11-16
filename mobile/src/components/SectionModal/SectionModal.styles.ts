import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modal: {
        width: '100%',
        maxWidth: 600,
        maxHeight: '85%',
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },

    header: {
        paddingVertical: 18,
        paddingHorizontal: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },

    closeButton: {
        padding: 5,
    },

    content: {
        paddingVertical: 15,
        paddingHorizontal: 22,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        paddingVertical: 12,
    },

    item: {
        flex: 1,
        minWidth: 0,
        gap: 5,
    },

    itemDescription: {
        fontSize: 13,
        color: colors.gray,
    },

    subitems: {
        paddingLeft: 20,
        borderLeftWidth: 2,
        borderLeftColor: colors.gray,
        marginLeft: 5,
    },

    subitemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    mainToggle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        marginBottom: 5,
    },

    visibilityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    visibilityText: {
        fontSize: 12,
    },

    visibilitySwitch: {
        width: 36,
        height: 20,
        borderRadius: 20,
        backgroundColor: colors.gray,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },

    visibilitySwitchActive: {
        backgroundColor: colors.green,
    },

    switchCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.white,
    },

    switchCircleActive: {
        alignSelf: 'flex-end',
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        paddingVertical: 18,
        paddingHorizontal: 22,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
    },

    footerButton: {
        paddingVertical: 9,
        paddingHorizontal: 20,
        borderRadius: 6,
    },

    cancelButton: {
        backgroundColor: colors.lightGray,
    },

    saveButton: {
        backgroundColor: colors.green,
    },

    cancelButtonText: {
        color: colors.gray,
    },

    saveButtonText: {
        color: colors.white,
    },
});

export default styles;