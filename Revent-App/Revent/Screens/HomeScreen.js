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
import {Icon} from '@rneui/base';
import {theme} from '../theme';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const user = useSelector(state => state.user);
  const name = user.name;

  const [isloading, setIsloading] = useState(true);
  const [total, setTotal] = useState(0);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [allValuesAreNotZero, setAllValuesAreNotZero] = useState(false);
  const [chartType, setChartType] = useState('time');

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
        labelTextStyle: {color: 'black', fontSize: 16},
      }));

      const tempPieData = sequentialMonths.map((month, index) => ({
        categories: convertedArray[month].map((item, subIndex) => ({
          ...item,
        })),
      }));

      const summedData = {};

      tempPieData.forEach(item => {
        item.categories.forEach(nestedItem => {
          const {categories, value} = nestedItem;
          if (summedData[categories]) {
            summedData[categories] += value;
          } else {
            summedData[categories] = value;
          }
        });
      });

      const pieData = Object.entries(summedData).map(
        ([categories, value], index) => ({
          categories,
          value,
          color: colours[index % colours.length], // Assign color based on index
          key: index,
        }),
      );

      const totalValue = barData.reduce(
        (accumulator, item) => accumulator + item.value,
        0,
      );
      setTotal(totalValue);
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
      {/* loading */}
      <ProgressDialog
        visible={isloading}
        label={'Please wait...'}
        loaderColor={theme.colors.themeDark}
      />

      {/* header nav */}
      <View style={styles.headerNav}>
        <View style={styles.headerNavLeft}>
          <Icon color={theme.colors.themeDark} size={40} name="chevron-left" />
        </View>
        <View style={styles.headerNavRight}>
          <Icon
            color={theme.colors.textDark}
            style={styles.notificationIcon}
            name="notifications-outline"
            type="ionicon"
          />
          <Icon
            color={theme.colors.textDark}
            style={styles.profileIcon}
            name="person"
          />
        </View>
      </View>
      {/* page title and view selector */}
      <View style={styles.viewSelector}>
        <Text style={{fontSize: 20}}>Spending</Text>
        <View style={styles.bigTitleGroup}>
          <Text
            style={{
              fontSize: 54,
              lineHeight: 54,
              color: theme.colors.textDark,
            }}>
            Analytics
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{fontSize: 20}}>2023</Text>
            <Icon
              style={{marginTop: 10}}
              size={15}
              color={theme.colors.textMuted}
              name="chevron-down"
              type="ionicon"
            />
          </View>
        </View>
        <View style={styles.toggleSwitchGroup}>
          <View style={styles.toggleSwitch}>
            <TouchableOpacity
              onPress={() => setChartType('time')}
              style={
                chartType == 'time'
                  ? styles.toggleSwitchOn
                  : styles.toggleSwitchOff
              }>
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                  color: theme.colors.textDark,
                }}>
                Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChartType('category')}
              style={
                chartType == 'category'
                  ? styles.toggleSwitchOn
                  : styles.toggleSwitchOff
              }>
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                  color: theme.colors.textDark,
                }}>
                Category
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* graph header */}
      <View style={styles.graphHeader}>
        <Text style={{fontSize: 20}}>Total Amount</Text>
        <Text
          style={{fontSize: 54, lineHeight: 54, color: theme.colors.textDark}}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {/* graph view */}
      {allValuesAreNotZero ? (
        <View
          style={{
            marginVertical: 20,
            width: '100%',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text>You have no receipts...</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Collect Receipt')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 50,
              backgroundColor: theme.colors.textLight,
              borderWidth: 1,
              borderColor: theme.colors.themeVDark,
            }}>
            <Text>Click to add first receipt</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.graph}>
          {chartType == 'time' && (
            <View style={styles.chart}>
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                spacing={32}
                frontColor="lightgray"
                data={barData.map((item, index) => ({
                  ...item,
                  frontColor: theme.colors.themeVDark,
                }))}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelPrefix="$"
              />
            </View>
          )}
          {chartType == 'category' && (
            <View style={styles.chart}>
              {selectedBarIndex !== null && (
                <View
                  style={{
                    marginBottom: -22,
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <PieChart
                    showText
                    data={pieData}
                    radius={screenWidth * 0.25}
                  />
                  <View
                    style={{
                      width: '70%',
                      flexDirection: 'column',
                      justifyContent: 'space-evenly',
                    }}>
                    {pieData.map((item, index) => {
                      console.log(item.categories);
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
          )}
        </View>
      )}
      {/* quick actions menu */}
      <View style={styles.quickActionsGroup}>
        <Text style={{fontSize: 16}}>Quick</Text>
        <Text
          style={{fontSize: 24, lineHeight: 24, color: theme.colors.textDark}}>
          Actions
        </Text>
        <View style={styles.actionIconGroup}>
          <View style={styles.iconGroup}>
            <Icon
              size={25}
              style={styles.actionIcon}
              name="bulb-outline"
              type="ionicon"
            />
            <Text>Insights</Text>
          </View>
          <View style={styles.iconGroup}>
            <Icon
              size={25}
              style={styles.actionIcon}
              name="time-outline"
              type="ionicon"
            />
            <Text>History</Text>
          </View>
          <View style={styles.iconGroup}>
            <Icon
              size={25}
              style={styles.actionIcon}
              name="settings-outline"
              type="ionicon"
            />
            <Text>Settings</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  headerNavRight: {
    flexDirection: 'row',
    gap: 10,
  },
  notificationIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: theme.colors.themeDark,
  },
  profileIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: theme.colors.themeDark,
    color: theme.colors.themeLight,
  },
  viewSelector: {
    paddingHorizontal: 20,
  },
  bigTitleGroup: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'baseline',
  },
  toggleSwitchGroup: {
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    justifyContent: 'center',
  },
  toggleSwitch: {
    width: '70%',
    borderRadius: 50,
    backgroundColor: theme.colors.themeVLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSwitchOn: {
    width: '45%',
    backgroundColor: theme.colors.themeDark,
    padding: 10,
    margin: 5,
    borderRadius: 40,
  },
  toggleSwitchOff: {
    width: '45%',
    padding: 10,
    margin: 5,
    borderRadius: 40,
  },
  graphHeader: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  graph: {
    paddingHorizontal: 20,
  },
  quickActionsGroup: {
    padding: 20,
  },
  actionIconGroup: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  actionIcon: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: theme.colors.themeDark,
  },
  iconGroup: {justifyContent: 'flex-start', alignItems: 'center'},
  chart: {
    width: screenWidth - 20,
    paddingBottom: 20,
  },
});

export default HomeScreen;
