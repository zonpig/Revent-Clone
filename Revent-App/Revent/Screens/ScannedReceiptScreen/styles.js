import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray',
  },
  sectionContent: {
    alignSelf: 'center',
    width: '50%',
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: theme.colors.textLight,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.themeVDark,
  },
});

export default styles;
