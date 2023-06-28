import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Icon} from '@rneui/themed';
import stringTimeFormat from '../utilities/stringTimeFormat';

const ReceiptListItem = ({item, onPress}) => {
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setTotalCost(
      item?.items.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0),
    );
  }, []);

  let imageSource;

  switch (item.type) {
    case 'food' || 'Food':
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
      <View style={styles.left}>
        <Image style={styles.leftLeftChild} source={imageSource} />
        <View style={styles.leftRightRightChild}>
          <Text style={styles.companyText}>{item?.company}</Text>
          <Text style={styles.methodText}>card</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.rightLeftChild}>
          <Text style={styles.companyText}>${totalCost.toFixed(2)}</Text>
          <Text style={styles.methodText}>{stringTimeFormat(item.time)}</Text>
        </View>
        <View style={styles.rightRightChild}>
          <TouchableOpacity onPress={onPress}>
            <Icon color={'#5F5F5F'} name="chevron-right" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReceiptListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  left: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  leftLeftChild: {
    marginRight: 10,
    marginTop: 10,
    height: 35,
    width: 35,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  companyText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000000',
    marginBottom: 5,
  },
  methodText: {fontSize: 16, color: '#5F5F5F'},
  right: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  rightRightChild: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
