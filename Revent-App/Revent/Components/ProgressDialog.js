import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';

const ProgressDialog = ({visible, label, loaderColor, labelStyle}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color={loaderColor ? loaderColor : '#0d0'}
          />
          <Text style={[styles.label, labelStyle ? labelStyle : {}]}>
            {label ? label : 'Please wait...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#00000089',
    fontSize: 18,
    fontWeight: '700',
    textAlignVertical: 'center',
    marginLeft: 15,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 80,
    borderRadius: 5,
    width: '80%',
    padding: 20,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default ProgressDialog;
