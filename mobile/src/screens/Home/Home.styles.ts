
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  header: {
    marginBottom: 35,
  },

  pageTitle: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: colors.gray,
    fontSize: 15,
  },

  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 16,
    padding: 25,
    width: '100%',
  },

  userAvatar: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  avatarText: {
    color: colors.main,
    fontSize: 25,
    fontWeight: '600',
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    color: colors.secondary,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 7,
  },

  email: {
    color: colors.gray,
    fontSize: 14,
    marginBottom: 7,
  },

  member: {
    color: colors.main,
    fontSize: 13,
    fontWeight: '500',
  },

  logoutButton: {
    marginTop: 24,
    height: 48,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    },

    logoutButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    },
});

export default styles;
