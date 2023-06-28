import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import ProgressDialog from '../../components/ProgressDialog';
import {doc, getDoc} from 'firebase/firestore/lite';
import {db} from '../../utilities/firebase';
import {useSelector} from 'react-redux';
import {Icon} from '@rneui/base';
import styles from './styles';
import {theme} from '../../theme';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const user = useSelector(state => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [allValuesAreNotZero, setAllValuesAreNotZero] = useState(false);
  const [chartType, setChartType] = useState('time');

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
        if (month === 'user' || month === 'year') {
          continue;
        }
        const indivTotal = spendingsData[month].total;
        const categories = spendingsData[month].categories;
        monthlyTotals.push({month, indivTotal});
        monthlyCategories.push({month, categories});
      }

      monthlyTotals.sort(
        (a, b) => parseInt(a.month, 10) - parseInt(b.month, 10),
      );
      monthlyCategories.sort(
        (a, b) => parseInt(a.month, 10) - parseInt(b.month, 10),
      );

      const totalsArray = monthlyTotals.map(item => item.indivTotal);

      const categoriesArray = monthlyCategories.map(item => item.categories);
      const convertedArray = categoriesArray.map(item => {
        return Object.keys(item).map((key, index) => {
          return {
            value: item[key],
            categories: key,
          };
        });
      });

      const newBarData = sequentialMonths.map((month, index) => ({
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

      const newPieData = Object.entries(summedData).map(
        ([categories, value], index) => ({
          categories,
          value,
          color: colours[index % colours.length], // Assign color based on index
          key: index,
        }),
      );

      const totalValue = newBarData.reduce(
        (accumulator, item) => accumulator + item.value,
        0,
      );
      setTotal(totalValue);
      setAllValuesAreNotZero(newBarData.every(item => item.value === 0));

      await setBarData(newBarData);
      await setPieData(newPieData);
      setSelectedBarIndex(barData.length - 1);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      // setErrorMessage(error.message);
    }
  };

  const renderLegend = (text, color, value, key) => {
    const label = text.charAt(0).toUpperCase() + text.slice(1);
    return (
      <View key={key} style={styles.pieLegend}>
        <View style={styles.pieLegendBox(color)} />
        <Text style={styles.pieLegendText}>
          {label || ''}: {'\n'} {value}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getSpendings();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* loading */}
      <ProgressDialog
        visible={isLoading}
        label={'Please wait...'}
        loaderColor={theme.colors.themeDark}
      />

      {/* header nav */}
      <View style={styles.headerNav}>
        <View style={styles.headerNavLeft} />
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
        <Text style={styles.smallText}>Spending</Text>
        <View style={styles.bigTitleGroup}>
          <Text style={styles.bigText}>Analytics</Text>
          <View style={styles.chevronGroup}>
            <Text style={styles.smallText}>2023</Text>
            <Icon
              style={styles.chevronIcon}
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
                chartType === 'time'
                  ? styles.toggleSwitchOn
                  : styles.toggleSwitchOff
              }>
              <Text style={styles.toggleSwitchText}>Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChartType('category')}
              style={
                chartType === 'category'
                  ? styles.toggleSwitchOn
                  : styles.toggleSwitchOff
              }>
              <Text style={styles.toggleSwitchText}>Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* graph header */}
      <View style={styles.graphHeader}>
        <Text style={styles.smallText}>Total Amount</Text>
        <Text style={styles.bigText}>${total.toFixed(2)}</Text>
      </View>

      {/* graph view */}
      {allValuesAreNotZero ? (
        <View style={styles.noReceiptBox}>
          <Text>You have no receipts...</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Collect ReceiptScreen')}
            style={styles.collectReceipt}>
            <Text>Click to add first receipt</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.graph}>
          {chartType === 'time' && (
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
          {chartType === 'category' && (
            <View style={styles.chart}>
              {selectedBarIndex !== null && (
                <View style={styles.pieChartView}>
                  <PieChart
                    showText
                    data={pieData}
                    radius={screenWidth * 0.25}
                  />
                  <View style={styles.pieChartLegendView}>
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
        <Text style={styles.smallText}>Quick</Text>
        <Text style={styles.actions}>Actions</Text>
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
              onPress={() => navigation.navigate('History')}
            />
            <Text>History</Text>
          </View>
          <View style={styles.iconGroup}>
            <Icon
              size={25}
              style={styles.actionIcon}
              name="settings-outline"
              type="ionicon"
              onPress={() => navigation.navigate('Settings')}
            />
            <Text>Settings</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
