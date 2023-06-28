import {View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Icon} from '@rneui/themed';
import styles from './styles';

const SplashScreen = ({navigation}) => {
  const user = useSelector(state => state.user); // get the user from redux store

  const retrieveUser = async () => {
    try {
      if (user) {
        setTimeout(() => {
          navigation.replace('Tabs'); // navigate to User Home screen
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.replace('SignIn'); // // navigate to login screen if there is no authUser store in aysnc storage
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check the authUser and navigate to screens accordingly on initial render
  useEffect(() => {
    retrieveUser();
  });

  return (
    <View style={styles.container}>
      <Icon type="ionicon" size={50} name="receipt" color="white" />
    </View>
  );
};

export default SplashScreen;
