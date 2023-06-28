import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 5,
    marginBottom: 15,
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.themeVDark,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  actionButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    height: 30,
    width: 30,
    backgroundColor: theme.colors.themeDark,
    borderRadius: 5,
    elevation: 2,
  },
});

export default styles;
