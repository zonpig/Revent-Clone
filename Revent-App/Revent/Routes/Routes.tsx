import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {TabParamsList} from './Tabs';
import Tabs from './Tabs';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import SignInScreen from '../screens/SignInScreen/SignInScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import ReceiptScreen from '../screens/ReceiptScreen/ReceiptScreen';
import ScannedReceiptScreen from '../screens/ScannedReceiptScreen/ScannedReceiptScreen';
import {SelectImageScreen} from '../screens/SelectImageScreen';
import {ProcessImageScreen} from '../screens/ProcessImageScreen';
import {ManualInputScreen} from '../screens/ManualInputScreen';
import InputtedReceiptScreen from '../screens/InputtedReceiptScreen';

export type RootStackParamsList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Receipt: undefined;
  Settings: undefined;
  Tabs: NavigatorScreenParams<TabParamsList>;
  ScannedReceipt: undefined;
  SelectImage: undefined;
  ProcessImage: {uri: string};
  ManualInput: undefined;
  InputtedReceipt: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamsList>();

const Routes = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="Receipt" component={ReceiptScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
        <RootStack.Screen name="Tabs" component={Tabs} />
        <RootStack.Screen
          name="ScannedReceipt"
          component={ScannedReceiptScreen}
        />
        <RootStack.Screen name="SelectImage" component={SelectImageScreen} />
        <RootStack.Screen name="ProcessImage" component={ProcessImageScreen} />
        <RootStack.Screen name="ManualInput" component={ManualInputScreen} />
        <RootStack.Screen
          name="InputtedReceipt"
          component={InputtedReceiptScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
