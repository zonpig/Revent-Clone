import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import ProgressDialog from '../Components/ProgressDialog';
import {doc, getDoc} from 'firebase/firestore/lite';
import {db} from '../Firebase/firebase';
import {useSelector} from 'react-redux';
import {theme} from '../theme';

const screenWidth = Dimensions.get('window').width;

const Home = ({navigation}) => {
  const isFocused = useIsFocused();

  const user = useSelector(state => state.user);
  const name = user.name;

  const [isloading, setIsloading] = useState(true);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [allValuesAreNotZero, setAllValuesAreNotZero] = useState(false);

  const [greeting, setGreeting] = useState('');
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const colours = ['#F5C6FA', '#F2FADC', '#B1D4DF', '#F4C5CB', '#FFEB5A'];

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

  const getSequentialMonths = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const sequentialMonths = [];

    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Wrap around to previous year if needed
      sequentialMonths.push(monthIndex);
    }

    return sequentialMonths;
  };

  const getSpendings = async () => {
    try {
      const spendingsID = user.spendings;
      const spendings = await getDoc(doc(db, 'spendings', spendingsID));
      const spendingsData = spendings.data();

      const sequentialMonths = getSequentialMonths();

      const monthlyTotals = [];
      const monthlyCategories = [];

      for (const month in spendingsData) {
        if (month === 'user' || month === 'year') continue;
        const total = spendingsData[month].total;
        const categories = spendingsData[month].categories;
        monthlyTotals.push({month, total});
        monthlyCategories.push({month, categories});
      }

      monthlyTotals.sort((a, b) => parseInt(a.month) - parseInt(b.month));
      monthlyCategories.sort((a, b) => parseInt(a.month) - parseInt(b.month));

      const totalsArray = monthlyTotals.map(item => item.total);

      const categoriesArray = monthlyCategories.map(item => item.categories);
      const convertedArray = categoriesArray.map(item => {
        return Object.keys(item).map((key, index) => {
          return {
            value: item[key],
            categories: key,
          };
        });
      });

      const barData = sequentialMonths.map((month, index) => ({
        value: totalsArray[month],
        label: months[month],
      }));
      const pieData = sequentialMonths.map((month, index) => ({
        categories: convertedArray[month].map((item, subIndex) => ({
          ...item,
          color: colours[subIndex % colours.length], // Assign color based on index
        })),
      }));

      setAllValuesAreNotZero(barData.every(item => item.value === 0));

      await setBarData(barData);
      await setPieData(pieData);
      setSelectedBarIndex(barData.length - 1);
      setIsloading(false);
    } catch (error) {
      console.log(error);
      // setErrorMessage(error.message);
    }
  };

  const handleBarPress = (item, index) => {
    setSelectedBarIndex(index);
  };

  const renderLegend = (text, color, value, key) => {
    label = text.charAt(0).toUpperCase() + text.slice(1);
    return (
      <View
        key={key}
        style={{flexDirection: 'row', marginBottom: 12, alignItems: 'center'}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{color: 'black', fontSize: 16}}>
          {label || ''}: {'\n'} {value}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (isFocused) {
      setIsloading(true);
      getSpendings();
      getCurrentLocalTime();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ProgressDialog
        visible={isloading}
        label={'Please wait...'}
        loaderColor={Colors.primary}
      />
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Hello {name}</Text>
        <Text style={styles.screenNameParagraph}>{greeting}</Text>
      </View>

      {allValuesAreNotZero ? (
        <View style={{marginVertical: 20, width: '100%', alignItems: 'center'}}>
          <Text>You have no receipts...</Text>
          <TouchableOpacity
            style={{
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderRadius: 50,
              backgroundColor: theme.colors.themeDark,
            }}>
            Add first Receipt
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.chart}>
            <BarChart
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              spacing={32}
              frontColor="lightgray"
              data={barData.map((item, index) => ({
                ...item,
                frontColor:
                  index === selectedBarIndex ? '#177AD5' : 'lightgray',
              }))}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelPrefix="$"
              onPress={handleBarPress}
            />
          </View>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          <View style={styles.chart}>
            {selectedBarIndex !== null && (
              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <PieChart
                  showText
                  data={pieData[selectedBarIndex]?.categories}
                  radius={screenWidth * 0.25}
                  // textColor="black"
                  // textSize={16}
                  // showValuesAsLabels
                  // focusOnPress
                />
                <View
                  style={{
                    width: '70%',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                  }}>
                  {pieData[selectedBarIndex]?.categories.map((item, index) => {
                    return renderLegend(
                      item.categories,
                      item.color,
                      item.value,
                      index,
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirecion: 'row',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  screenNameContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 0,
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
