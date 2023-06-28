import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './Tabs';
import Splash from '../Screens/Splash';
import SignInScreen from '../Screens/SignInScreen';
import Settings from '../Screens/Settings';
import SignUpScreen from '../Screens/SignUpScreen';
import ReceiptScreen from '../Screens/ReceiptScreen';
import TagDetail from '../Screens/TagDetail';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="signin" component={SignInScreen} />
        <Stack.Screen name="signup" component={SignUpScreen} />
        <Stack.Screen name="receipt" component={ReceiptScreen} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="tab" component={Tabs} />
        <Stack.Screen name="tagdetail" component={TagDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
