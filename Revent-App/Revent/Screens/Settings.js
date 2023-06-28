import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionList from '../Components/OptionList';
import {theme} from '../theme';

const Settings = ({navigation}) => {
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
          <OptionList
            text={'Set Two-Factor Authentication'}
            Icon={Ionicons}
            iconName={'lock-closed-outline'}
            onPress={() => console.log('')}
          />
          <OptionList
            text={'Language'}
            Icon={Ionicons}
            iconName={'language-outline'}
            onPress={() => console.log('')}
          />
          <OptionList
            text={'Font Size'}
            Icon={Ionicons}
            iconName={'text-outline'}
            onPress={() => console.log('')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>Notifications</Text>
          <OptionList
            text={'Notification Settings'}
            Icon={Ionicons}
            iconName={'notifications-circle-outline'}
            onPress={() => console.log('')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>About</Text>
          <OptionList
            text={'Terms of Use'}
            Icon={Ionicons}
            iconName={'newspaper-outline'}
            onPress={() => console.log('')}
          />
          <OptionList
            text={'Privacy Policy'}
            Icon={Ionicons}
            iconName={'shield-checkmark-outline'}
            onPress={() => console.log('')}
          />
          <OptionList
            text={'Report a problem'}
            Icon={Ionicons}
            iconName={'alert-circle-outline'}
            onPress={() => console.log('')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginVertical: 20,
    width: '100%',
  },
  backButton: {},
  headerContainer: {
    alignSelf: 'flex-start',
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    marginLeft: 3,
    fontSize: 32,
    color: theme.colors.textDark,
  },
  sectionContainer: {
    width: '80%',
    marginBottom: 24,
  },
  subHeader: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    marginTop: 17,
    color: '#888899',
    marginLeft: 3,
  },
  logoutContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});
