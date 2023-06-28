import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Image} from 'react-native';
import {Icon} from '@rneui/base';
import {theme} from '../theme';

const ReceiptScreen = ({navigation, route}) => {
  const {receiptDetail} = route.params;
  console.log(route);
  const [typeColor, setTypeColor] = useState('');
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

  // set total cost, order detail, order status on initial render
  useEffect(() => {
    console.log(receiptDetail.type);
    setError('');
    setAlertType('error');
    setTypeColor(receiptDetail.type + 'Bg');
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
        return accumulator + object.price * object.quantity;
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

  let imageSource;

  switch (receiptDetail.type) {
    case 'food':
      imageSource = require('../assets/images/food.png');
      break;
    case 'entertainment':
      imageSource = require('../assets/images/entertainment.png');
      break;
    case 'entertainment':
      imageSource = require('../assets/images/entertainment.png');
      break;
    case 'grocery':
      imageSource = require('../assets/images/grocery.png');
      break;
    case 'others':
      imageSource = require('../assets/images/others.png');
      break;
    case 'shopping':
      imageSource = require('../assets/images/shopping.png');
      break;
    default:
      imageSource = require('../assets/images/others.png');
      break;
  }

  return (
    <View style={styles.container}>
      <View
        // source={require('../assets/images/gradient_bg_large.png')}
        style={{
          ...styles.imageBackground,
          backgroundColor: theme.colors[typeColor],
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            style={{alignSelf: 'flex-start', marginTop: 10}}
            color="black"
            name="chevron-left"
            type="ionicons"
            size={30}
          />
        </TouchableOpacity>
        <View style={styles.glassContainer}>
          {/* header */}
          <View style={styles.headerGroup}>
            <Image style={styles.catIcon} source={imageSource} />
            <Text style={styles.title}>{receiptDetail.company}</Text>
            <Text style={styles.normalText}>{receiptDetail.location}</Text>
            <Text style={styles.normalText}>{receiptDetail.time}</Text>
          </View>
          {/* receipt items */}
          <ScrollView style={styles.bodyGroup}>
            {receiptDetail.items.map((item, index) => (
              <View key={index} style={styles.orderItemContainer}>
                <Text style={styles.normalText}>{item.quantity}</Text>
                <Text style={styles.normalText}>{item.item}</Text>
                <Text style={styles.normalText}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
          {/* total amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              Total: ${totalCost.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  catIcon: {
    width: 70,
    height: 70,
  },
  glassContainer: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  contentContainer: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden',
    elevation: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0,
  },

  gradient: {
    // ...StyleSheet.absoluteFillObject,
  },
  blur: {
    // ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 32,
    color: theme.colors.themeDark,
    textDecorationStyle: 'solid',
  },
  normalText: {
    color: theme.colors.textDark,
    fontSize: 16,
  },
  headerGroup: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bodyGroup: {
    width: '100%',
    marginTop: 30,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  amountContainer: {
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.themeDark,
  },
  amountText: {
    color: theme.colors.textDark,
  },
});

export default ReceiptScreen;
