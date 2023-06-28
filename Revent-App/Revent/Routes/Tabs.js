import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home';
import ReceiptHistoryScreen from '../Screens/ReceiptHistoryScreen';
import Profile from '../Screens/Profile';
import ReadNFC from '../Screens/ReadNFC';
import {theme} from '../theme'
import HomeScreen from '../Screens/HomeScreen';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          // To edit icons, find name from https://oblador.github.io/react-native-vector-icons/

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Collect Receipt') {
            iconName = focused ? 'wifi' : 'wifi-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.themeDark,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Collect Receipt" component={ReadNFC} />
      <Tab.Screen name="History" component={ReceiptHistoryScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Tabs;
