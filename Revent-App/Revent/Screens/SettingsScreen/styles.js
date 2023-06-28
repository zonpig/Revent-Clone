import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginVertical: 20,
    width: '100%',
  },
  backButton: {},
  headerContainer: {
    alignSelf: 'flex-start',
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    marginLeft: 3,
    fontSize: 32,
    color: theme.colors.textDark,
  },
  sectionContainer: {
    width: '80%',
    marginBottom: 24,
  },
  subHeader: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    marginTop: 17,
    color: '#888899',
    marginLeft: 3,
  },
  logoutContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default styles;
