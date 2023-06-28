import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import NdefMessage from '../Components/NdefMessage';
import {getTechList} from '../utils/getTechList';
import ReceiptListItem from '../Components/ReceiptListItem';
import {useState} from 'react';
import {Ndef} from 'react-native-nfc-manager';
import {auth, db} from '../Firebase/firebase';
import {doc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore/lite';
import {theme} from '../theme';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

function TagDetail(props) {
  const {tag} = props.route.params;
  const {navigation} = props;
  const [receipt, setReceipt] = useState();

  const techs = getTechList(tag);
  const ndef =
    Array.isArray(tag.ndefMessage) && tag.ndefMessage.length > 0
      ? tag.ndefMessage[0]
      : null;

  const handleOrderDetail = item => {
    navigation.navigate('receipt', {
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
    <ScrollView style={[styles.wrapper, {padding: 10}]}>
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
            style={{
              alignSelf: 'center',
              width: '50%',
              marginTop: 20,
              paddingHorizontal: 30,
              paddingVertical: 5,
              backgroundColor: theme.colors.textLight,
              borderRadius: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.colors.themeVDark,
            }}
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
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray',
  },
});

export default TagDetail;
