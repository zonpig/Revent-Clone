import React from 'react';
import {useState} from 'react';
import {Text, View, Image, TouchableOpacity, SafeAreaView} from 'react-native';
import FormError from '../../components/FormError';
import {auth} from '../../utilities/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useDispatch} from 'react-redux';
import {db} from '../../utilities/firebase';
import {doc, getDoc} from 'firebase/firestore/lite';
import {setUser} from '../../redux/userSlice';
import FormSuccess from '../../components/FormSuccess';
import styles from './styles';
import CTextInput from '../../components/CTextInput';

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
        return navigation.navigate('Tabs');
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
        <View style={styles.header} />
        <View style={styles.hero}>
          <Image
            style={styles.heroImage}
            source={require('../../assets/images/revent_light.png')}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Sign In</Text>
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
                source={require('../../assets/images/apple.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.googleIcon}
                source={require('../../assets/images/google.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.socialIcon}
                source={require('../../assets/images/facebook.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('SignUp')}>
                Sign Up
              </Text>
            </Text>
          </View>
          {displayFormErr === true ? (
            <FormError hideErrOverlay={setDisplayFormErr} err={errorMessage} />
          ) : null}
          {isLoading === true ? <FormSuccess /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignInScreen;
