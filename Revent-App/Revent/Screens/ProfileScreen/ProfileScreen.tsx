import React from 'react';
import {Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {TabParamsList} from '../../routes/Tabs';
import type {RootStackParamsList} from '../../routes/Routes';

import styles from './styles';

import ProfileListItem from '../../components/ProfileListItem/ProfileListItem';
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard';

import {signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../../utilities/firebase';
import {clearUser} from '../../redux/userSlice';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, 'Profile'>,
  NativeStackScreenProps<RootStackParamsList>
>;

const ProfileScreen = ({navigation}: Props) => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const name: string = user.name;
  const email: string = user.email;

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
        <UserProfileCard name={name} email={email} />
      </View>
      <View style={styles.OptionsContainer}>
        <ProfileListItem
          text={'My Account'}
          iconName={'person'}
          onPress={() => console.log('working....')}
        />
        <ProfileListItem
          text={'Settings'}
          iconName={'settings-sharp'}
          onPress={() => navigation.navigate('Settings')}
        />
        <ProfileListItem
          text={'Help Center'}
          iconName={'help-circle'}
          onPress={() => console.log('working....')}
        />
        <ProfileListItem
          text={'Logout'}
          iconName={'log-out'}
          onPress={() => {
            navigation.navigate('SignIn');
            out();
          }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
