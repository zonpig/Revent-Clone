import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from '../theme';

const CTextInput = props => {
  return (
    <View style={styles.formInputGroup}>
      <Text style={styles.formInputLabel}>{props.label}</Text>
      <TextInput {...props} style={styles.textInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 50,
    paddingLeft: 25,
    borderColor: theme.colors.themeDark,
    borderWidth: 1,
    fontSize: 16,
  },
  formInputLabel: {
    paddingLeft: 30,
    fontSize: 16,
    marginBottom: 4,
  },
  formInputGroup: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CTextInput;
