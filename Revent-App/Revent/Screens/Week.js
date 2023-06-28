import {doc, getDoc} from 'firebase/firestore/lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {db} from '../Firebase/firebase';

const screenWidth = Dimensions.get('window').width;

const Week = ({navigation, user}) => {
  const barData = [
    {value: 250, label: 'M'},
    {value: 500, label: 'T'},
    {value: 745, label: 'W'},
    {value: 320, label: 'T'},
    {value: 600, label: 'F'},
  ];

  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const getCurrentLocalTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    let greeting;
    if (hours >= 5 && hours < 12) {
      greeting = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    setGreeting(greeting);
  };

  const getUserData = async () => {
    try {
      // fetching list of receipts from  user
      const userRef = doc(db, 'users', user);
      const userSnap = await getDoc(userRef);
      const userId = userSnap.data();
      const name = userId.name;
      setName(name);
      // const receiptIdList = userSnap.data().receipts;
      // const receiptListPromises = receiptIdList.map(async id => {
      //   const rec = await getDoc(doc(db, 'receipts', id));
      //   console.log('receipt loaded: ', id);
      //   return rec.data();
      // });
      // const receiptList = await Promise.all(receiptListPromises);
      // setReceipts(receiptList);
      // console.log(receipts);
    } catch (error) {
      console.log(error);
      // setErrorMessage(error.message);
    }
  };

  const checkFunctions = () => {
    getUserData();
    console.log(greeting);
  };

  const pieData = [
    {
      breakdown: [
        {value: 0.5, label: 'Food', color: '#FFCD56'},
        {value: 0.2, label: 'Groceries', color: '#FF6384'},
        {value: 0.15, label: 'Entertainment', color: '#36A2EB'},
      ],
      label: 'Week 1',
    },
    {
      breakdown: [
        {value: 0.1, label: 'Food', color: '#FFCD56'},
        {value: 0.2, label: 'Groceries', color: '#FF6384'},
        {value: 0.3, label: 'Entertainment', color: '#36A2EB'},
        {value: 0.4, label: 'Subscription', color: '#4BC0C0'},
      ],
      label: 'Week 2',
    },
    {
      breakdown: [
        {value: 0.1, label: 'Food', color: '#FFCD56'},
        {value: 0.2, label: 'Groceries', color: '#FF6384'},
        {value: 0.05, label: 'Entertainment', color: '#36A2EB'},
        {value: 0.5, label: 'Subscription', color: '#4BC0C0'},
        {value: 0.15, label: 'Others', color: '#FF9F40'},
      ],
      label: 'Week 3',
    },
    {
      breakdown: [
        {value: 0.3, label: 'Vacation', color: '#FFCD56'},
        {value: 0.4, label: 'Groceries', color: '#FF6384'},
        {value: 0.15, label: 'Entertainment', color: '#36A2EB'},
        {value: 0.1, label: 'Subscription', color: '#4BC0C0'},
        {value: 0.05, label: 'Others', color: '#FF9F40'},
      ],
      label: 'Week 4',
    },
  ];

  const renderLegend = (text, color) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{color: 'black', fontSize: 16}}>{text || ''}</Text>
      </View>
    );
  };

  useEffect(() => {
    getUserData();
    getCurrentLocalTime();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={'#707981'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>May</Text>
      </View>

      <ScrollView>
        {pieData.map((item, index) => {
          return (
            <>
              <Text style={styles.chartTitle}>{item.label}</Text>
              <View style={styles.chart}>
                <View
                  style={{
                    marginTop: 20,
                    marginHorizontal: 10,
                    flexDirection: 'row',
                  }}>
                  <PieChart
                    data={item.breakdown}
                    onPress={item => console.log(item)}
                    focusOnPress
                  />
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'column',
                      justifyContent: 'space-evenly',
                    }}>
                    {item.breakdown.map(item => {
                      return renderLegend(item.label, item.color);
                    })}
                  </View>
                </View>
              </View>
            </>
          );
        })}
      </ScrollView>

      <Button title="Check Functions" onPress={checkFunctions} />
    </View>
  );
};

export default Week;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirecion: 'row',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  topBarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
  },
  screenNameContainer: {
    paddingLeft: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#707981',
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  // Add the following styles
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    width: screenWidth - 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
