import {StyleSheet} from 'react-native';
import {theme} from '../../theme';
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.themeDark,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 4,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heroImage: {
    resizeMode: 'contain',
    height: 200,
  },
  forgotPasswordText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  content: {
    paddingTop: 40,
    paddingBottom: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  textInput: {
    backgroundColor: theme.colors.textLight,
    borderRadius: theme.spacing.m,
    paddingLeft: theme.spacing.m,
  },
  formInputLabel: {
    paddingLeft: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  formInputGroup: {
    marginBottom: theme.spacing.l,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
  },
  signInText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textLight,
    fontWeight: 800,
  },
  divider: {
    color: '#000000',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 800,
  },
  socialsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginVertical: 30,
  },
  backIcon: {
    marginTop: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signUpText: {
    fontSize: 12,
    color: 'black',
  },
  signUpLink: {
    textDecorationLine: 'underline',
  },
  googleIcon: {
    borderWidth: 1,
    borderColor: '#dadada',
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
});
export default styles;
