import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme';

const OptionList = ({
  Icon,
  iconName,
  text,
  onPress,
  type,
  onPressSecondary,
}) => {
  return (
    <>
      {type == 'morden' ? (
        <View
          style={[styles.container, {backgroundColor: theme.colors.textLight}]}>
          <View style={styles.IconContainer}>
            <Icon name={iconName} size={24} color={theme.colors.themeLight} />
            <Text style={styles.listText}>{text}</Text>
          </View>
          <View style={styles.buttonContainer}>
            {onPressSecondary && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onPressSecondary}>
                <Icon name={'add'} size={15} color={theme.colors.white} />
              </TouchableOpacity>
            )}
            {onPress && (
              <TouchableOpacity style={styles.actionButton} onPress={onPress}>
                <Icon name={'eye'} size={15} color={theme.colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <View style={styles.IconContainer}>
            <Icon name={iconName} size={24} color={theme.colors.themeVDark} />
            <Text style={styles.listText}>{text}</Text>
          </View>
          <View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={24}
              color={theme.colors.themeVDark}
            />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default OptionList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 5,
    marginBottom: 15,
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.themeVDark,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  actionButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    height: 30,
    width: 30,
    backgroundColor: theme.colors.themeDark,
    borderRadius: 5,
    elevation: 2,
  },
});
