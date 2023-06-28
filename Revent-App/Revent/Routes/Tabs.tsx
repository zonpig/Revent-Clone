import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Icon} from '@rneui/themed';
import {theme} from '../theme';

import ReceiptHistoryScreen from '../screens/ReceiptHistoryScreen/ReceiptHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ReadNFCScreen from '../screens/ReadNFCScreen/ReadNFCScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

export type TabParamsList = {
  Home: undefined;
  CollectReceipt: undefined;
  History: undefined;
  Profile: undefined;
  Add: undefined;
};

const Tab = createBottomTabNavigator<TabParamsList>();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CollectReceipt') {
            iconName = focused ? 'wifi' : 'wifi-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add' : 'add-outline';
          }
          return (
            <Icon type="ionicon" name={iconName} size={size} color={color} />
          );
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.themeDark,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CollectReceipt" component={ReadNFCScreen} />
      <Tab.Screen name="History" component={ReceiptHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
