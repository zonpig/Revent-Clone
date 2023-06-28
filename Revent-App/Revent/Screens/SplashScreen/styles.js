import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    color: theme.colors.themeLight,
    fontSize: 50,
    fontWeight: 'bold',
  },
  logo: {
    resizeMode: 'contain',
    width: 80,
    height: 80,
  },
});

export default styles;
