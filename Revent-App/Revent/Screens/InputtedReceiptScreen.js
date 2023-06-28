import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ReceiptListItem from '../components/ReceiptListItem';
import {useState} from 'react';
import ProgressDialog from '../components/ProgressDialog';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore/lite';
import {db, auth} from '../utilities/firebase';
import {theme} from '../theme';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';

const InputtedReceiptScreen = props => {
  const {receiptData} = props.route.params;
  const {navigation} = props;

  const [addedReceipt, setAddedReceipt] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

  const addReceipt = async receipt => {
    const {company, location, time, items, total, type} = receipt;

    const docRef = await addDoc(collection(db, 'receipts'), {
      company,
      location,
      time,
      items,
      total,
      type,
    });

    return docRef.id;
  };

  const registerReceiptToUser = async id => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        receipts: arrayUnion(id),
      });
      console.log('Receipt registered to user');
    } catch (error) {
      console.log(error.message);
      // setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const getReceipt = async () => {
      const docId = await addReceipt(receiptData);
      await registerReceiptToUser(docId);
      await refreshUser();
      setAddedReceipt(await (await getDoc(doc(db, 'receipts', docId))).data());
      setIsLoading(false);
    };

    if (receiptData) {
      getReceipt();
    }
  }, [receiptData]);

  return (
    <ScrollView style={styles.wrapper}>
      {/* loader */}
      <ProgressDialog
        visible={isLoading}
        label={'Please wait...'}
        loaderColor={theme.colors.themeDark}
      />
      {addedReceipt && (
        <>
          <ReceiptListItem
            item={addedReceipt}
            onPress={() => {
              handleOrderDetail(addedReceipt);
              console.log(addedReceipt);
            }}
          />
          <TouchableOpacity
            style={styles.sectionContent}
            onPress={() => navigation.navigate('History')}>
            <Text>View history</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default InputtedReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.textLight,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    color: theme.colors.textDark,
    fontSize: 32,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallerText: {
    fontSize: 20,
    fontWeight: 500,
    color: theme.colors.textMuted,
  },
  moneyText: {
    fontSize: 32,
    fontWeight: 500,
    color: '#0C586F',
  },
  historyListHeader: {
    backgroundColor: theme.colors.themeLight,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 50,
    elevation: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  historyListTitle: {
    fontWeight: 500,
    fontSize: 20,
    color: theme.colors.textDark,
  },
  bottomRowRightChild: {
    marginTop: 5,
    justifyContent: 'center',
  },
  insightsImage: {
    height: 50,
    width: 50,
  },
  content: {
    paddingTop: 10,
    backgroundColor: theme.colors.textLight,
    flex: 1,
  },
  transaction: {
    flex: 1,
    width: '100%',
  },
  dateEntry: {
    marginBottom: 20,
  },
  time: {
    paddingLeft: 20,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
