import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import styles from './styles';

// Pre-step, call this before any NFC operations
NfcManager.start();

const ReadNFCScreen = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      readNdef();
      return () => NfcManager.cancelTechnologyRequest();
    }),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      NfcManager.cancelTechnologyRequest();
    });

    return unsubscribe;
  }, [navigation]);

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      if (tag) {
        navigation.navigate('ScannedReceiptScreen', {tag});
        () => NfcManager.cancelTechnologyRequest();
      }
      console.log('Tag found', tag);
    } catch (ex) {
      console.log('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      {/* <TouchableOpacity onPress={readNdef}> */}
      <View style={styles.contentDrawer}>
        <Text style={styles.title}>Ready to Scan</Text>
        <Image
          style={styles.logo}
          source={require('../../assets/images/nfc.png')}
        />
        <Text style={styles.normalText}>Please tap the Revent device</Text>
        {/* </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}>
          <Text style={styles.normalText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReadNFCScreen;
