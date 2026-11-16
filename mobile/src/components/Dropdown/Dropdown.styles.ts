import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        minWidth: 0,
        position: 'relative',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.main,
    },

    required: {
        color: colors.red,
    },

    // Ana dropdown kutusu
    trigger: {
        width: '100%',
        height: 44,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,

        backgroundColor: colors.white,
    },

    triggerActive: {
        borderColor: colors.secondary,
        shadowColor: colors.secondary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },

    triggerText: {
        flex: 1,
        color: colors.main,
        fontSize: 14,
        fontWeight: '400',
    },

    placeholder: {
        color: colors.gray,
    },

    disabled: {
        backgroundColor: colors.lightGray,
        opacity: 0.7,
    },

    // Ok ikonu
    dropdownIcon: {
        color: colors.gray,
    },

    dropdownIconRotated: {
        transform: [{ rotate: '180deg' }],
    },

    // Açılan seçenek listesi
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContent: {
        width: '100%',
        maxWidth: 400,
        maxHeight: 320,
        padding: 12,

        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 10,

        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },

    modalTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.main,
        marginBottom: 10,
        paddingHorizontal: 4,
    },

    list: {
        width: '100%',
        flexGrow: 0,
    },

    // Seçenekler
    option: {
        width: '100%',
        minHeight: 38,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 9,
        paddingHorizontal: 10,

        borderRadius: 6,
        backgroundColor: 'transparent',
    },

    optionPressed: {
        backgroundColor: colors.primaryPurple,
    },

    selectedOption: {
        backgroundColor: colors.primaryPurple,
    },

    optionText: {
        flex: 1,
        color: colors.gray,
        fontSize: 14,
    },

    selectedText: {
        color: colors.secondary,
        fontWeight: '600',
    },

    checkIcon: {
        color: colors.secondary,
        marginLeft: 8,
    },

    empty: {
        padding: 12,
        textAlign: 'center',
        color: colors.gray,
        fontSize: 13,
    },
});