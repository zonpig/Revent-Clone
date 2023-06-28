import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionList from '../Components/OptionList';
import UserProfileCard from '../Components/UserProfileCard';

import {signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../Firebase/firebase';
import {clearUser} from '../redux/userSlice';
import {theme} from '../theme';

const Profile = ({navigation}) => {
  const user = useSelector(state => state.user); // get the user from redux store
  const dispatch = useDispatch();

  const name = user.name;
  const email = user.email;

  const out = async () => {
    await signOut(auth);
    dispatch(clearUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard Icon={Ionicons} name={name} email={email} />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={'My Account'}
          Icon={Ionicons}
          iconName={'person'}
          onPress={() => navigation.navigate('myaccount')}
        />
        <OptionList
          text={'Settings'}
          Icon={Ionicons}
          iconName={'settings-sharp'}
          onPress={() => navigation.navigate('settings')}
        />
        {/* !For future use --- */}
        {/* 
        <OptionList
          text={"Help Center"}
          Icon={Ionicons}
          iconName={"help-circle"}
          onPress={() => console.log("working....")}
        /> */}
        {/* !For future use ---- End */}
        <OptionList
          text={'Logout'}
          Icon={Ionicons}
          iconName={'log-out'}
          onPress={() => {
            out();
            navigation.navigate('signin');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirecion: 'row',
    backgroundColor: theme.colors.textLight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  UserProfileCardContianer: {
    width: '100%',
    height: '25%',
  },
  screenNameContainer: {
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.textDark,
  },
  OptionsContainer: {
    width: '100%',
  },
  Button: {
    width: '80%',
    height: 50,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
export default Profile;
