import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {Icon} from '@rneui/base';
import {theme} from '../../theme';
import styles from './styles';

const ReceiptScreen = ({navigation, route}) => {
  const {receiptDetail} = route.params;
  console.log(route);
  const [typeColor, setTypeColor] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  // set total cost, order detail, order status on initial render
  useEffect(() => {
    setTypeColor(receiptDetail.type + 'Bg');

    setTotalCost(
      receiptDetail?.items.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0),
    );
  }, []);

  let imageSource;

  switch (receiptDetail.type) {
    case 'food':
      imageSource = require('../../assets/images/food.png');
      break;
    case 'entertainment':
      imageSource = require('../../assets/images/entertainment.png');
      break;
    case 'entertainment':
      imageSource = require('../../assets/images/entertainment.png');
      break;
    case 'grocery':
      imageSource = require('../../assets/images/grocery.png');
      break;
    case 'others':
      imageSource = require('../../assets/images/others.png');
      break;
    case 'shopping':
      imageSource = require('../../assets/images/shopping.png');
      break;
    default:
      imageSource = require('../../assets/images/others.png');
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
            style={styles.backIcon}
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

export default ReceiptScreen;
