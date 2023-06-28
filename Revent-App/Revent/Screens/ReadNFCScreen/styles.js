import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.themeLight,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
  },
  logo: {
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  normalText: {
    fontSize: 24,
  },
  contentDrawer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 20,
    paddingTop: 40,
    borderColor: '#DADADA',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cancelButton: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default styles;
