import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ProgressDialog from '../Components/ProgressDialog';
import {useIsFocused} from '@react-navigation/native';
import {auth} from '../Firebase/firebase';
import {doc, getDoc} from 'firebase/firestore/lite';
import {useSelector} from 'react-redux';
import {db} from '../Firebase/firebase';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';

import ReceiptListItem from '../Components/ReceiptListItem';
import onlyUnique from '../utilities/onlyUnique';

import {Icon} from '@rneui/base';
import stringDateFormat from '../utilities/stringDateFormat';
import getMonthIntFromStr from '../utilities/getMonthIntFromStr';
import {theme} from '../theme';

const ReceiptHistoryScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const user = useSelector(state => state.user);

  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState('Please wait...');
  const [refeshing, setRefreshing] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [receiptDates, setReceiptDates] = useState([]);
  const [total, setTotal] = useState(0);
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
    navigation.navigate('receipt', {
      receiptDetail: item,
    });
  };

  const getReceipts = async () => {
    try {
      // fetching list of receipts from user
      setIsloading(true);
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
        console.log('a: ', aDateTime, ' b: ', bDateTime);

        if (comp === 0) {
          if (bDateTime > aDateTime) {
            comp = 1;
          } else if (bDateTime < aDateTime) {
            comp = -1;
          }
        }

        return comp;
      });

      await setReceipts(receiptList);
      console.log(receipts);
      setIsloading(false);
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
              style={{height: 50, width: 50}}
              source={require('../assets/images/insights.png')}
            />
          </View>
        </View>
      </View>

      {/* History list header */}
      <View style={styles.historyListHeader}>
        <Text style={styles.historyListTitle}>Last Transactions</Text>
        <Icon
          name="filter-outline"
          color={theme.colors.textDark}
          type="ionicon"
        />
      </View>

      <View style={styles.content}>
        {/* loader */}
        <ProgressDialog
          visible={isloading}
          label={label}
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
            style={{flex: 1, width: '100%'}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }>
            {receiptDates.map((date, index) => {
              return (
                <View key={index} style={{marginBottom: 20}}>
                  <Text
                    style={{
                      paddingLeft: 20,
                      fontSize: 12,
                      color: theme.colors.textMuted,
                    }}>
                    {date}
                  </Text>
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
            <View style={styles.emptyView}></View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default ReceiptHistoryScreen;

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
  content: {
    paddingTop: 10,
    backgroundColor: theme.colors.textLight,
    flex: 1,
  },
});
