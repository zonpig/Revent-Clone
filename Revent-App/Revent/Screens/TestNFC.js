// import React, {useState, useEffect} from 'react';
// import {
//   Button,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
// } from 'react-native';
// import BackIcon from 'react-native-vector-icons/Feather';
// import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// // Pre-step, call this before any NFC operations
// NfcManager.start();

// const TestNFC = ({navigation}, props) => {
//   const [hasNfc, setHasNfc] = useState(false);
//   const [log, setLog] = useState('Ready...');
//   const [text, setText] = useState('');

//   useEffect(() => {
//     async function checkNfc() {
//       setHasNfc(NfcManager.isSupported());
//     }
//     checkNfc();
//   }, []);

//   readNdef = async () => {
//     try {
//       // register for the NFC tag with NDEF in it
//       await NfcManager.requestTechnology(NfcTech.Ndef);
//       // the resolved tag object will contain `ndefMessage` property
//       const tag = await NfcManager.getTag();
//       console.warn('Tag found', tag);
//     } catch (ex) {
//       console.warn('Oops!', ex);
//     } finally {
//       // stop the nfc scanning
//       NfcManager.cancelTechnologyRequest();
//     }
//   };

//   if (hasNfc === null) {
//     return null;
//   } else if (!hasNfc) {
//     return (
//       <View style={styles.wrapper}>
//         <Text>Your device doesn't support NfcManager</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.wrapper}>
//       <TouchableOpacity style={styles.buttonRead} onPress={readNdef}>
//         <Text style={styles.buttonText}>Read</Text>
//       </TouchableOpacity>

//       <View style={styles.log}>
//         <Text> {log} </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     margin: 20,
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textInput: {
//     marginLeft: 20,
//     marginRight: 20,
//     marginBottom: 10,
//     height: 50,
//     textAlign: 'center',
//     color: 'black',
//   },
//   buttonRead: {
//     marginLeft: 20,
//     marginRight: 20,
//     width: 100,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: '#006C5B',
//   },
//   buttonText: {
//     color: '#ffffff',
//   },
//   log: {
//     marginTop: 30,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default TestNFC;

import React from 'react';
import {useEffect, useState} from 'react';
import {
  Button,
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import NfcProxy from '../NFCProxy';
import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';
// import {Button, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import qs from 'query-string';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

function TestNFC(props) {
  const {navigation} = props;
  const [supported, setSupported] = useState(null);
  const [enabled, setEnabled] = useState(null);
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;

  // receipt UID is received by NFC, this function is called to append the receipt to user
  const registerReceiptToUser = async receiptId => {
    try {
      const userRef = doc(db, 'users', user);
      await updateDoc(userRef, {
        receipts: arrayUnion(receiptId),
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  async function initNfc() {
    try {
      const success = await NfcProxy.init();
      setSupported(success);
      setEnabled(await NfcProxy.isEnabled());

      if (success) {
        function onBackgroundTag(bgTag) {
          navigation.navigate('TagDetail', {tag: bgTag});
        }

        function onDeepLink(url, launch) {
          try {
            const customScheme = [
              'com.washow.nfcopenrewriter://', // android
              'com.revteltech.nfcopenrewriter://', // ios
            ].find(scheme => {
              return scheme === url.slice(0, scheme.length);
            });

            if (!customScheme) {
              return;
            }

            url = url.slice(customScheme.length);

            // issue #23: we might have '?' in our payload, so we cannot simply "split" it
            let action = url;
            let query = '';
            let splitIdx = url.indexOf('?');

            if (splitIdx > -1) {
              action = url.slice(0, splitIdx);
              query = url.slice(splitIdx);
            }

            const params = qs.parse(query);
            if (action === 'share') {
              const sharedRecord = JSON.parse(params.data);
              if (sharedRecord.payload?.tech === NfcTech.Ndef) {
                navigation.navigate('NdefWrite', {savedRecord: sharedRecord});
              } else if (sharedRecord.payload?.tech === NfcTech.NfcA) {
                navigation.navigate('CustomTransceive', {
                  savedRecord: sharedRecord,
                });
              } else if (sharedRecord.payload?.tech === NfcTech.NfcV) {
                navigation.navigate('CustomTransceive', {
                  savedRecord: sharedRecord,
                });
              } else if (sharedRecord.payload?.tech === NfcTech.IsoDep) {
                navigation.navigate('CustomTransceive', {
                  savedRecord: sharedRecord,
                });
              } else {
                console.warn('unrecognized share payload tech');
              }
            }
          } catch (ex) {
            console.warn('fail to parse deep link', ex);
          }
        }

        // get the initial launching tag
        const bgTag = await NfcManager.getBackgroundTag();
        if (bgTag) {
          onBackgroundTag(bgTag);
        } else {
          const link = await Linking.getInitialURL();
          console.warn('DEEP LINK', link);
          if (link) {
            onDeepLink(link, true);
          }
        }

        // listen to other background tags after the app launched
        NfcManager.setEventListener(
          NfcEvents.DiscoverBackgroundTag,
          onBackgroundTag,
        );

        // listen to the NFC on/off state on Android device
        if (Platform.OS === 'android') {
          NfcManager.setEventListener(
            NfcEvents.StateChanged,
            ({state} = {}) => {
              NfcManager.cancelTechnologyRequest().catch(() => 0);
              if (state === 'off') {
                setEnabled(false);
              } else if (state === 'on') {
                setEnabled(true);
              }
            },
          );
        }

        Linking.addEventListener('url', event => {
          if (event.url) {
            onDeepLink(event.url, false);
          }
        });
      }
    } catch (ex) {
      console.warn(ex);
      Alert.alert('ERROR', 'fail to init NFC', [{text: 'OK'}]);
    }
  }

  async function readTag() {
    // attempt reading tag on mount
    const tag = await NfcProxy.readTag();
    if (tag) {
      navigation.navigate('tagdetail', {tag});
    }
  }

  useEffect(() => {
    console.log('effect ran');
    initNfc();
    readTag();
  }, [navigation]);

  function renderNfcButtons() {
    return (
      <View
        style={{
          flex: 2,
          alignItems: 'stretch',
          alignSelf: 'center',
          width,
        }}>
        {/* <Button
          title="READ TAGs"
          mode="contained"
          onPress={async () => {
            const tag = await NfcProxy.readTag();
            if (tag) {
              navigation.navigate('tagdetail', {tag});
            }
          }}
          style={{marginBottom: 10}}></Button> */}

        {/* <Button
          title="MY RECORDS"
          mode="outlined"
          onPress={async () => {
            navigation.navigate('SavedRecord');
          }}></Button> */}
      </View>
    );
  }

  function renderNfcNotEnabled() {
    return (
      <View
        style={{
          flex: 2,
          alignItems: 'stretch',
          alignSelf: 'center',
          width,
        }}>
        <Text style={{textAlign: 'center', marginBottom: 10}}>
          Your NFC is not enabled. Please first enable it and hit CHECK AGAIN
          button
        </Text>

        <Button
          title="GO TO NFC SETTINGS"
          onPress={() => NfcProxy.goToNfcSetting()}
          style={{marginBottom: 10}}
        />

        <Button
          title="CHECK AGAIN"
          onPress={async () => {
            setEnabled(await NfcProxy.isEnabled());
          }}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Text>Placeholder</Text>
      <View style={{flex: 1, padding}}>
        {supported && !enabled && renderNfcNotEnabled()}
        {supported && enabled && renderNfcButtons()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  settingIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 0,
    right: 20,
  },
});

export default TestNFC;
