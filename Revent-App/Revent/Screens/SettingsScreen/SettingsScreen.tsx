import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../../routes/Routes';

import {Icon} from '@rneui/themed';
import styles from './styles';
import {theme} from '../../theme';

import ProfileListItem from '../../components/ProfileListItem/ProfileListItem';

type Props = NativeStackScreenProps<RootStackParamsList, 'Settings'>;

const SettingsScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon size={35} name="chevron-left" color={theme.colors.textDark} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>Account</Text>
          <ProfileListItem
            text={'Set Two-Factor Authentication'}
            iconName={'lock-closed-outline'}
            onPress={() => console.log('')}
          />
          <ProfileListItem
            text={'Language'}
            iconName={'language-outline'}
            onPress={() => console.log('')}
          />
          <ProfileListItem
            text={'Font Size'}
            iconName={'text-outline'}
            onPress={() => console.log('')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>Notifications</Text>
          <ProfileListItem
            text={'Notification Settings'}
            iconName={'notifications-circle-outline'}
            onPress={() => console.log('')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>About</Text>
          <ProfileListItem
            text={'Terms of Use'}
            iconName={'newspaper-outline'}
            onPress={() => console.log('')}
          />
          <ProfileListItem
            text={'Privacy Policy'}
            iconName={'shield-checkmark-outline'}
            onPress={() => console.log('')}
          />
          <ProfileListItem
            text={'Report a problem'}
            iconName={'alert-circle-outline'}
            onPress={() => console.log('')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
