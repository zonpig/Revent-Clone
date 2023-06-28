import React, {FC, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@rneui/themed';
import {theme} from '../../theme';
import styles from './styles';

type ProfileListItemProps = {
  iconName: string;
  text: string;
  onPress: () => void;
};

const ProfileListItem = ({iconName, text, onPress}: ProfileListItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.IconContainer}>
        <Icon
          name={iconName}
          type="ionicon"
          size={24}
          color={theme.colors.themeVDark}
        />
        <Text style={styles.listText}>{text}</Text>
      </View>
      <View>
        <Icon
          type="material"
          name="arrow-forward-ios"
          size={24}
          color={theme.colors.themeVDark}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileListItem;
