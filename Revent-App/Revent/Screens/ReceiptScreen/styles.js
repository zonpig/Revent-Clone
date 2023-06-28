import {StyleSheet} from 'react-native';
import {theme} from '../../theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  catIcon: {
    width: 70,
    height: 70,
  },
  glassContainer: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  backIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  contentContainer: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden',
    elevation: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0,
  },

  gradient: {
    // ...StyleSheet.absoluteFillObject,
  },
  blur: {
    // ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 32,
    color: theme.colors.themeDark,
    textDecorationStyle: 'solid',
  },
  normalText: {
    color: theme.colors.textDark,
    fontSize: 16,
  },
  headerGroup: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bodyGroup: {
    width: '100%',
    marginTop: 30,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  amountContainer: {
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.themeDark,
  },
  amountText: {
    color: theme.colors.textDark,
  },
});
export default styles;
