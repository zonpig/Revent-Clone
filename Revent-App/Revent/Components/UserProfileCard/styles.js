import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarContainer: {
    display: 'flex',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  infoContainer: {
    display: 'flex',
    padding: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 20,
    backgroundColor: theme.colors.themeLight,
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  secondaryText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  icon: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: theme.colors.themeLight,
  },
});

export default styles;
