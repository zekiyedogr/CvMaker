import { StyleSheet } from 'react-native';

import colors from '../../../constants/colors';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    previewContainer: {
        width: '100%',
        padding: 10,
        paddingTop: 20,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.white,
    },

    loadingText: {
        color: colors.secondary,
        fontSize: 14,
    },

    errorText: {
        color: colors.secondary,
        fontSize: 14,
    },

    editorPanel: {
        backgroundColor: '#FFFFFF',
        margin: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 3,
    },

    templateNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    navigationButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },

    navigationButtonText: {
        fontSize: 28,
        color: '#333333',
    },

    templateName: {
        fontSize: 16,
        fontWeight: '600',
    },

    editorSection: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },

    editorTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },

    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },

    editorActions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 15,
    },

    actionButtonContainer: {
        flex: 1,
        minWidth: 0,
    },

    sizeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
    },

    sizeButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sizeButtonText: {
        fontSize: 22,
    },

    sizeValue: {
        fontSize: 16,
        fontWeight: '600',
    },

    colorPalettes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    colorPalette: {
        flexDirection: 'row',
        padding: 4,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        gap: 3,
    },

    selectedColorPalette: {
        borderColor: '#333333',
        borderWidth: 2,
    },

    colorItem: {
        width: 25,
        height: 25,
        borderRadius: 3,
    },
});

export default styles;
