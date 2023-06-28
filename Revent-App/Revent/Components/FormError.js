import {Overlay} from '@rneui/themed';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/themed';

const FormError = props => {
  const hideOverlay = () => {
    props.hideErrOverlay(false);
  };

  return (
    <Overlay
      overlayStyle={styles.Overlay}
      isVisible={true}
      onBackdropPress={hideOverlay}>
      <Icon type="ionicon" name="close-circle" size={60} color="red" />
      <Text style={styles.errorMessage}>{props.err}</Text>
      <TouchableOpacity style={styles.Button} onPress={hideOverlay}>
        <Text style={styles.buttonText}>Okay</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  Overlay: {
    width: '90%',
    height: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    color: '#000',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  Button: {
    width: '80%',
    height: 50,
    color: '#000',
    backgroundColor: '#000',
    borderRadius: 10,
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FormError;
