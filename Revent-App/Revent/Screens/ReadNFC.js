import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {theme} from '../theme'

// Pre-step, call this before any NFC operations
NfcManager.start();

const ReadNFC = ({navigation}) => {
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
        navigation.navigate('tagdetail', {tag});
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
          source={require('../assets/images/nfc.png')}
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

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.themeLight,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
  },
  logo: {
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  normalText: {
    fontSize: 24,
  },
  contentDrawer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 20,
    paddingTop: 40,
    borderColor: '#DADADA',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cancelButton: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default ReadNFC;
