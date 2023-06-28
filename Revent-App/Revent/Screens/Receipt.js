import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const colors = {
  primary: '#FB6831',
  primary_light: '#FFC8B2',
  primary_shadow: '#FB6A04',
  secondary: '#31C4FB',
  tertiary: '#AEE8FD',
  success: '#90ee90',
  danger: '#FF4848',
  shadow: '#E7E8EA',
  warning: '#FBD431',
  info: '#F8F9FA',
  light: '#F5F5F5',
  dark: '#343A3F',
  muted: '#707981',
  white: '#FFFFFF',
};

const Receipt = ({navigation, route}) => {
  const {receiptDetail} = route.params;
  console.log(route);
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState('Loading..');
  const [error, setError] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState('');
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const labels = ['Processing', 'Shipping', 'Delivery'];
  const [trackingState, setTrackingState] = useState(1);

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.primary,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: theme.colors.white,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
  };

  //method to convert time to AM PM format
  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('');
  }

  // set total cost, receipt detail  on initial render
  useEffect(() => {
    console.log(receiptDetail);
    setError('');
    setAlertType('error');
    if (receiptDetail?.status == 'delivered') {
      setStatusDisable(true);
    } else {
      setStatusDisable(false);
    }
    setValue(receiptDetail?.status);
    setAddress(
      receiptDetail?.country +
        ', ' +
        receiptDetail?.city +
        ', ' +
        receiptDetail?.shippingAddress,
    );
    setTotalCost(
      receiptDetail?.items.reduce((accumulator, object) => {
        return (accumulator + object.price) * object.quantity;
      }, 0),
    );
    if (receiptDetail?.status === 'pending') {
      setTrackingState(1);
    } else if (receiptDetail?.status === 'shipped') {
      setTrackingState(2);
    } else {
      setTrackingState(3);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Receipt Detials</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Filler</Text>
        </View>
      </View>
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.receiptContainer}>
          <View style={styles.company}>
            <Text>{receiptDetail.company}</Text>
            <Text>{receiptDetail.location}</Text>
            <Text>{receiptDetail.time}</Text>
          </View>

          {receiptDetail.items.map((item, index) => (
            <View key={index} style={styles.orderItemContainer}>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.name}>{item.item}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Total</Text>
            <Text>${totalCost.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.emptyView}></View>
      </ScrollView>
    </View>
  );
};

export default Receipt;

const styles = StyleSheet.create({
  container: {
    flexDirecion: 'row',
    backgroundColor: '#00B3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  screenNameContainer: {
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: {flex: 1, width: '100%', padding: 5},

  containerNameContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.muted,
    fontSize: 13,
  },
  receiptContainer: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: '100%',
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: theme.colors.white,
    width: '110%',
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyView: {
    height: 20,
  },
  company: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantity: {
    width: 50,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  price: {
    width: 70,
    textAlign: 'right',
  },
});
