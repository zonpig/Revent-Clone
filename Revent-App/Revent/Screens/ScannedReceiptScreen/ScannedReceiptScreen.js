import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import ReceiptListItem from '../../components/ReceiptListItem';
import {useState} from 'react';
import {Ndef} from 'react-native-nfc-manager';
import {auth, db} from '../../utilities/firebase';
import {doc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore/lite';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/userSlice';

const ScannedReceiptScreen = props => {
  const {tag} = props.route.params;
  const {navigation} = props;
  const [receipt, setReceipt] = useState();

  const ndef =
    Array.isArray(tag.ndefMessage) && tag.ndefMessage.length > 0
      ? tag.ndefMessage[0]
      : null;

  const handleOrderDetail = item => {
    navigation.navigate('Receipt', {
      receiptDetail: item,
    });
  };

  const dispatch = useDispatch();
  const refreshUser = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userId = userSnap.data();
    dispatch(setUser(userId));
  };

  const registerReceiptToUser = async receiptId => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        receipts: arrayUnion(receiptId),
      });
    } catch (error) {
      console.log(error.message);
      // setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const getReceipt = async () => {
      const uri = Ndef.uri.decodePayload(ndef.payload);
      const docId = uri.substring(uri.indexOf('.app/') + 5);
      await registerReceiptToUser(docId);
      await refreshUser();
      setReceipt(await (await getDoc(doc(db, 'receipts', docId))).data());
    };
    getReceipt();
  });

  return (
    <ScrollView style={styles.wrapper}>
      {/* <View style={styles.section}>
        <Text style={styles.sectionLabel}>UID</Text>
        <Text>{tag.id || '---'}</Text>
      </View> */}

      {/* <View style={styles.section}>
        <Text style={styles.sectionLabel}>TECHNOLOGIES</Text>
        <View style={styles.row}>
          {techs.map(tech => (
            <Button
              title={tech}
              key={tech}
              mode="outlined"
              style={{marginRight: 5, marginBottom: 5}}></Button>
          ))}
        </View>
      </View> */}

      {receipt && (
        <>
          <ReceiptListItem
            item={receipt}
            onPress={() => {
              handleOrderDetail(receipt);
              console.log(receipt);
            }}
          />
          <TouchableOpacity
            style={styles.sectionContent}
            onPress={() => navigation.navigate('History')}>
            <Text>View history</Text>
          </TouchableOpacity>
        </>
      )}

      {/* <View style={styles.section}>
        <Text style={styles.sectionLabel}>NDEF</Text>
        {ndef ? <NdefMessage ndef={ndef} /> : <Text>---</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TAG OBJECT</Text>
        <Text>{JSON.stringify(tag, null, 2)}</Text>
      </View> */}
    </ScrollView>
  );
};

export default ScannedReceiptScreen;
