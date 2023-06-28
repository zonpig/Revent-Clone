import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import ProgressDialog from '../../components/ProgressDialog';
import {useIsFocused} from '@react-navigation/native';
import {auth} from '../../utilities/firebase';
import {doc, getDoc} from 'firebase/firestore/lite';
import {useSelector} from 'react-redux';
import {db} from '../../utilities/firebase';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/userSlice';

import ReceiptListItem from '../../components/ReceiptListItem';
import onlyUnique from '../../utilities/onlyUnique';

import {Icon} from '@rneui/base';
import stringDateFormat from '../../utilities/stringDateFormat';
import getMonthIntFromStr from '../../utilities/getMonthIntFromStr';
import {theme} from '../../theme';
import styles from './styles';

const ReceiptHistoryScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const user = useSelector(state => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [receiptDates, setReceiptDates] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  var receiptList = [];
  const dispatch = useDispatch();

  const refreshUser = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userId = userSnap.data();
    dispatch(setUser(userId));
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    refreshUser();
    getReceipts();
    setRefreshing(false);
  };

  // method to navigate to order detail screen of a specific receipt
  const handleOrderDetail = item => {
    navigation.navigate('Receipt', {
      receiptDetail: item,
    });
  };

  const getReceipts = async () => {
    try {
      // fetching list of receipts from user
      const receiptIdList = user.receipts;
      const receiptListPromises = receiptIdList.map(async id => {
        const rec = await getDoc(doc(db, 'receipts', id));
        return rec.data();
      });
      receiptList = await Promise.all(receiptListPromises);
      // inc. sorting array of receipts first
      receiptList.sort(function (a, b) {
        a = a.time;
        b = b.time;
        var aDate = a.split(' ');
        var bDate = b.split(' ');
        if (Number(aDate[0]) < 10) {
          aDate[0] = `0${aDate[0]}`;
        }
        if (Number(bDate[0]) < 10) {
          bDate[0] = `0${bDate[0]}`;
        }
        a = aDate.join(' ');
        b = bDate.join(' ');

        aDate = a.split(' ');
        bDate = b.split(' ');

        // first see which year is bigger
        var comp = bDate[2].localeCompare(aDate[2]);

        if (comp !== 0) {
          return comp;
        }

        // see which month is bigger
        if (getMonthIntFromStr(bDate[1]) > getMonthIntFromStr(aDate[1])) {
          comp = 1;
        } else if (
          getMonthIntFromStr(bDate[1]) < getMonthIntFromStr(aDate[1])
        ) {
          comp = -1;
        }

        if (comp !== 0) {
          return comp;
        }

        // see which date is bigger
        if (comp === 0) {
          comp = bDate[0].localeCompare(aDate[0]);
        }

        // see which time is bigger
        var aDateTime = new Date('2000-01-01 ' + aDate[3]);
        var bDateTime = new Date('2000-01-01 ' + bDate[3]);
        // console.log('a: ', aDateTime, ' b: ', bDateTime);

        if (comp === 0) {
          if (bDateTime > aDateTime) {
            comp = 1;
          } else if (bDateTime < aDateTime) {
            comp = -1;
          }
        }

        return comp;
      });

      if (receiptList !== receipts) {
        setIsLoading(true);
        await setReceipts(receiptList);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      // setErrorMessage(error.message);
    }
  };

  const getTotalMonthSpend = async () => {
    const month = new Date().getMonth() + 1;
    const spendingsID = user.spendings;
    const spendings = await getDoc(doc(db, 'spendings', spendingsID));
    const spendingsData = spendings.data()[month.toString()];
    setTotal(spendingsData.total);
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getReceipts();
      getTotalMonthSpend();
      refreshUser();
    }
  }, [isFocused]);

  // dates
  useEffect(() => {
    if (isFocused) {
      var dates = [];
      receipts.forEach(element => {
        dates.push(stringDateFormat(element.time));
      });

      dates = dates.filter(onlyUnique);

      setReceiptDates([...dates]);
    }
  }, [receipts, isFocused]);

  const PopupContent = () => {
    return (
      <View style={styles.popupContent}>
        <View style={styles.popHeaderRow}>
          <Text style={styles.popupHeaderTitle}>Receipt Import</Text>
          <Text style={styles.popupHeaderDescription}>
            Please select a method to import your old physical receipts or
            non-receipt expenses into the Revent app
          </Text>
        </View>
        <TouchableOpacity
          style={styles.popupOption}
          onPress={() => handleOptionSelect('manual')}>
          <Text style={styles.popupOptionText}>Manual Input</Text>
          <Icon name="chevron-right" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.popupOption}
          onPress={() => handleOptionSelect('image')}>
          <Text style={styles.popupOptionText}>Import from Image</Text>
          <Icon name="chevron-right" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleOptionSelect = option => {
    setSelectedOption(option);
    setPopupVisible(false);

    // Perform any additional actions based on the selected option
    if (option === 'manual') {
      navigation.navigate('ManualInput');
    } else if (option === 'image') {
      navigation.navigate('SelectImage');
    }
  };

  return (
    <View style={styles.container}>
      {/* page header */}
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Receipt History</Text>
        <View style={styles.bottomRow}>
          <View style={styles.bottomRowLeftChild}>
            <Text style={styles.smallerText}>Spent this month</Text>
            <Text style={styles.moneyText}>${total}</Text>
          </View>
          <View style={styles.bottomRowRightChild}>
            <Image
              style={styles.insightsImage}
              source={require('../../assets/images/insights.png')}
            />
          </View>
        </View>
      </View>

      {/* History list header */}
      <View>
        <View style={styles.historyListHeader}>
          <Text style={styles.historyListTitle}>Last Transactions</Text>
          <TouchableOpacity
            style={styles.importButton}
            onPress={() => setPopupVisible(true)}>
            <Icon
              name="cloud-upload-outline"
              color={theme.colors.textDark}
              type="ionicon"
              size={18}
            />
            <Text>Import</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={popupVisible} transparent={true}>
          <TouchableOpacity
            style={styles.popupOverlay}
            activeOpacity={1}
            onPress={() => setPopupVisible(false)}>
            <PopupContent />
          </TouchableOpacity>
        </Modal>
      </View>

      <View style={styles.content}>
        {/* loader */}
        <ProgressDialog
          visible={isLoading}
          label={'Please wait...'}
          loaderColor={theme.colors.themeDark}
        />

        {/* Reciept list */}
        {receiptDates.length === 0 ? (
          <View style={styles.ListContiainerEmpty}>
            <Text style={styles.secondaryTextSmItalic}>
              There are no receipts recorded yet...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.transaction}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }>
            {receiptDates.map((date, index) => {
              return (
                <View key={index} style={styles.dateEntry}>
                  <Text style={styles.date}>{date}</Text>
                  {receipts.map((receipt, index2) => {
                    if (stringDateFormat(receipt.time) === date) {
                      return (
                        <ReceiptListItem
                          item={receipt}
                          key={index2}
                          onPress={() => handleOrderDetail(receipt)}
                        />
                      );
                    }
                  })}
                </View>
              );
            })}
            <View style={styles.emptyView} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default ReceiptHistoryScreen;
