import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    header: {
        height: 75,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    backButton: {
        width: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    headerText: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },

    step: {
        width: 55,
        fontSize: 14,
        color: colors.gray,
        textAlign: 'right',
    },

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 20,
        gap: 20,
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
        marginBottom: 15,
    },

    photoContainer: {
        alignSelf: 'center',
        marginBottom: 15,
    },

    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1.5,
        borderColor: colors.lightGray,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },

    photoText: {
        fontSize: 13,
        color: colors.gray,
        marginTop: 7,
    },

    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 25,
        backgroundColor: colors.white,
    },
});

export default styles;