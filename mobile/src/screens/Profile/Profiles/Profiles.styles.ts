
import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    title: {
        color: colors.secondary,
        fontSize: 25,
        fontWeight: '700',
    },
    list: {
        gap: 20,
        paddingBottom: 20,
    },
    loader: {
        marginTop: 40,
    },
    emptyText: {
        color: colors.gray,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 40,
    },
});

export default styles;
