import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {auth} from '../Firebase/firebase';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import FormError from '../Components/FormError';
import FormSuccess from '../Components/FormSuccess';
import {httpsCallable} from 'firebase/functions';
import {doc, setDoc, getDoc} from 'firebase/firestore/lite';
import {functions, db} from '../Firebase/firebase';
import {theme} from '../theme';
import {Icon} from '@rneui/base';
import CTextInput from '../Components/CTextInput';

const SignUpScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayFormErr, setDisplayFormErr] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const createUser = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userRef = doc(db, 'users', userCredential.user.uid);
      // user document is created here to prevent conflict with server trigger
      await setDoc(
        userRef,
        {
          name: fullName,
          mobile: mobile,
          email: email,
          receipts: [],
        },
        {merge: true},
      );
      // callable function to set up spending record
      await httpsCallable(functions, 'addSpendingRecord')();
      setIsLoading(false);
      setSuccessMessage('Account created successfully!');
      const userSnap = await getDoc(userRef);
      const userId = await userSnap.data();
      dispatch(setUser(userId));
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        setErrorMessage('That email address is invalid!');
      }
      setDisplayFormErr(true);
    }
  };

  const validateForm = () => {
    var form_inputs = [fullName, email, mobile, password, confirmPassword];
    var password_match = password === confirmPassword;

    if (form_inputs.includes('') || form_inputs.includes(undefined)) {
      setErrorMessage('Please fill in all fields');
      return setDisplayFormErr(true);
    } else if (!password_match) {
      setErrorMessage('Passwords do not match');
      return setDisplayFormErr(true);
    } else if (password_match) return createUser();
  };

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Icon
            style={styles.backIcon}
            name="chevron-left"
            type="material"
            color={'white'}
            size={30}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.hero}>
          <Image
            style={styles.heroImage}
            source={require('../assets/images/revent_light.png')}
          />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.welcomeText}>Create Account...</Text>
          <CTextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={value => setFullName(value)}
          />
          <CTextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={value => setEmail(value)}
          />
          <CTextInput
            label="Mobile"
            placeholder="Enter your phone number"
            value={mobile}
            onChangeText={value => setMobile(value)}
          />
          <CTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            secureTextEntry
            onChangeText={value => setPassword(value)}
          />
          <CTextInput
            label="Confirm Password"
            placeholder="Enter your password again"
            value={confirmPassword}
            secureTextEntry
            onChangeText={value => setConfirmPassword(value)}
          />
          <TouchableOpacity
            onPress={() => validateForm()}
            style={styles.signInButton}>
            <Text style={styles.signInText}>SIGN UP</Text>
          </TouchableOpacity>
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
        </ScrollView>
        {displayFormErr ? (
          <FormError hideErrOverlay={setDisplayFormErr} err={errorMessage} />
        ) : null}

        {successMessage === 'Account created successfully!' ? (
          <FormSuccess
            successMessage={successMessage}
            close={setSuccessMessage}
          />
        ) : null}

        {isLoading ? <FormSuccess /> : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
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
    paddingBottom: 40,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
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
    marginBottom: 40,
    paddingVertical: 10,
  },
  signInText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textLight,
    fontWeight: 800,
  },
  backIcon: {
    marginTop: 5,
  },
});

export default SignUpScreen;
