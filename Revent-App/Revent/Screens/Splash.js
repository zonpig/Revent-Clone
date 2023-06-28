import {StyleSheet, Image, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';

const Splash = ({navigation}) => {
  const user = useSelector(state => state.user); // get the user from redux store

  retrieveUser = async () => {
    try {
      if (user) {
        setTimeout(() => {
          navigation.replace('tab'); // navigate to User Home screen
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.replace('signin'); // // navigate to login screen if there is no authUser store in aysnc storage
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check the authUser and navigate to screens accordingly on initial render
  useEffect(() => {
    retrieveUser();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons size={50} name="receipt" color="white" />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    color: theme.colors.themeLight,
    fontSize: 50,
    fontWeight: 'bold',
  },
  logo: {
    resizeMode: 'contain',
    width: 80,
    height: 80,
  },
});
