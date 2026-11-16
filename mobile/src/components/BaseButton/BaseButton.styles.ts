
import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  pressed: {
    backgroundColor: colors.main,
    transform: [{ translateY: -2 }],
    elevation: 4,
  },

  disabled: {
    opacity: 0.6,
  },

  loader: {
    color: colors.white,
  },
});
