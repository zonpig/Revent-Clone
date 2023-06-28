import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '../theme';

const UserProfileCard = ({Icon, name, email}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.avatarContainer}>
        <Icon
          style={{
            padding: 20,
            borderRadius: 100,
            backgroundColor: theme.colors.themeLight,
          }}
          name="person"
          size={60}
          color={theme.colors.themeVDark}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{name}</Text>
        <Text style={styles.secondaryText}>{email}</Text>
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarContainer: {
    display: 'flex',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  infoContainer: {
    display: 'flex',
    padding: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 20,
    backgroundColor: theme.colors.themeLight,
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  secondaryText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
