import React from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import FormError from '../Components/FormError';
import {auth} from '../Firebase/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useDispatch} from 'react-redux';
import {db} from '../Firebase/firebase';
import {doc, getDoc} from 'firebase/firestore/lite';
import {setUser} from '../redux/userSlice';
import FormSuccess from '../Components/FormSuccess';
import {theme} from '../theme';
import CTextInput from '../Components/CTextInput';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayFormErr, setDisplayFormErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const validateInput = () => {
    var form_inputs = [email, password];

    if (form_inputs.includes('') || form_inputs.includes(undefined)) {
      setErrorMessage('Please fill in all fields');
      return setDisplayFormErr(true);
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        setIsLoading(false);
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userId = userSnap.data();
        dispatch(setUser(userId));
        return navigation.navigate('tab');
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          setErrorMessage('User not found');
        } else if (err.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password');
        } else {
          setErrorMessage(err.message);
        }
        setIsLoading(false);
        return setDisplayFormErr(true);
      });
  };

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}></View>
        <View style={styles.hero}>
          <Image
            style={styles.heroImage}
            source={require('../assets/images/revent_light.png')}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <CTextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={value => setEmail(value)}
          />
          <CTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            secureTextEntry
            onChangeText={value => setPassword(value)}
          />
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => validateInput()}
            style={styles.signInButton}>
            <Text style={styles.signInText}>LOGIN</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>OR</Text>
          <View style={styles.socialsContainer}>
            <TouchableOpacity>
              <Image
                style={styles.socialIcon}
                source={require('../assets/images/apple.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.googleIcon}
                source={require('../assets/images/google.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.socialIcon}
                source={require('../assets/images/facebook.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('signup')}>
                Sign Up
              </Text>
            </Text>
          </View>
          {displayFormErr == true ? (
            <FormError hideErrOverlay={setDisplayFormErr} err={errorMessage} />
          ) : null}
          {isLoading == true ? <FormSuccess /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

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

export default SignInScreen;
