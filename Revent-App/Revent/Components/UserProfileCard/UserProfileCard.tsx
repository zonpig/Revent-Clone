import {Text, View} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';
import {theme} from '../../theme';
import styles from './styles';

type UserProfileCardProps = {
  name: string;
  email: string;
};

const UserProfileCard = ({name, email}: UserProfileCardProps) => {
  return (
    <View style={styles.Container}>
      <View style={styles.avatarContainer}>
        <Icon
          style={styles.icon}
          type="ionicon"
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
