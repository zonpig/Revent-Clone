import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Overlay} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '@rneui/themed';

const FormSuccess = ({successMessage, close}) => {
  const navigation = useNavigation();

  const handleOkPress = () => {
    close('');
    navigation.navigate('Tabs');
  };

  return successMessage ? (
    <Overlay overlayStyle={styles.Overlay} isVisible={true}>
      <Icon type="ionicon" name="checkmark-circle" size={60} color="green" />
      <Text style={styles.successMessage}>{successMessage}</Text>
      <TouchableOpacity style={styles.Button} onPress={handleOkPress}>
        <Text style={styles.buttonText}>Ok</Text>
      </TouchableOpacity>
    </Overlay>
  ) : (
    <Overlay overlayStyle={styles.Overlay} isVisible={true}>
      <ActivityIndicator size="large" color="#2FBBF0" />
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
  successMessage: {
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

export default FormSuccess;
