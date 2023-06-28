import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {DemoButton} from '../components/DemoButton';
import {recognizeImage, Response} from '../utilities/mlkit';
import { theme } from '../theme';
import CTextInput from '../components/CTextInput';
import { Icon } from '@rneui/base';

export const ProcessImageScreen = ({route, navigation}: any) => {
  const {width: windowWidth} = useWindowDimensions();
  const [aspectRatio, setAspectRation] = useState(1);
  const [receipt, setReceipt] = useState({});
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [items, setItems] = useState([{item: '', price: 0, quantity: 0}]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState('');

  const handleStoreChange = (text: string) => {
    setCompany(text);
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
  };

  const handleDateChange = (text: string) => {
    setTime(text);
  };

  const handleItemChange = (text: string, index: number, field: string) => {
    const updatedItems = [...items];
    if (field === 'price' || field === 'quantity') {
      const parsedValue = parseFloat(text);
      updatedItems[index][field] = parsedValue;
    } else {
      updatedItems[index][field] = text;
    }
    setItems(updatedItems);
  };

  const handleTotalChange = (text: string) => {
    const parsedTotal = parseFloat(text);
    setTotal(parsedTotal);
  };

  const handleTypeChange = (text: string) => {
    setType(text);
  };

  const handleAddItem = () => {
    const newItem = {item: '', price: 0, quantity: 0};
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };

  const handleSubmit = async () => {
    // Combine form fields into an object
    const receiptData = {
      type,
      company,
      location,
      time,
      items,
      total,
    };

    console.log(receiptData);

    // Navigate to InputtedReceiptScreen and pass the receiptData object
    navigation.navigate('InputtedReceipt', {receiptData});
  };

  const uri = route.params.uri;

  const proccessImage = async (url: string) => {
    if (url) {
      try {
        const response = await recognizeImage(url);
        console.log(response);
        if (response?.blocks?.length > 0) {
          setAspectRation(response.height / response.width);
          const companyText = response.blocks[3]?.text || '';
          const locationAndTimeText =
            response.blocks[4]?.text.split('\n') || [];
          const locationText = locationAndTimeText[0] || '';
          const dateText = locationAndTimeText[1] || '';
          const itemNamesText = response.blocks[5]?.text || '';
          const itemNames = itemNamesText.split('\n');
          const totalText = response.blocks[9]?.text || '';
          const totalValue = parseFloat(totalText.replace('Total: $', ''));
          setCompany(companyText);
          setLocation(locationText);
          setTime(dateText);
          setTotal(totalValue);

          const itemPricesText = response.blocks[11]?.text || '';
          const itemPrices = itemPricesText.split('\n');
          const itemsData = itemNames.map((item, index) => ({
            item,
            price: parseFloat(itemPrices[index]?.replace('$', '')) || '',
            quantity: 0,
          }));
          setItems(itemsData);

          console.log('Company:', companyText);
          console.log('Location:', locationText);
          console.log('Date:', dateText);
          console.log('Items:', itemsData);
          console.log('Total:', totalValue);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (uri) {
      proccessImage(uri);
    }
  }, [uri]);

  return (
    <ScrollView style={styles.outerContainer}>
      <SafeAreaView style={styles.innerContainer}>
      <View style={styles.header}>
          <Icon
            style={styles.backIcon}
            name="chevron-left"
            type="material"
            color={'white'}
            size={30}
            onPress={() => navigation.goBack()}
          />
        </View>
      <ScrollView style={styles.content}>
      <Image
        source={{uri}}
        // style={{width: windowWidth, height: windowWidth * aspectRatio}}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Confirm Receipt Details</Text>
      <Text style={{marginBottom: 20}}>Check and complete the receipt details below before saving the receipt.</Text>
      {/* <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Type</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={type}
          onChangeText={handleTypeChange}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Company</Text>
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={company}
          onChangeText={handleStoreChange}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={handleLocationChange}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={time}
          onChangeText={handleDateChange}
        />
      </View>
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsText}>Items</Text>
        <Button title="Add Item" onPress={handleAddItem} />
      </View> */}
      <CTextInput
        label="Receipt Category"
        placeholder="Enter receipt category"
        value={type}
        onChangeText={handleTypeChange}
      />
      <CTextInput
        label="Company"
        placeholder="Company"
        value={company}
        onChangeText={handleStoreChange}
      />
      <CTextInput
        label="Location"
        placeholder="Location"
        value={company}
        onChangeText={handleLocationChange}
      />
      <CTextInput
        label="Date"
        placeholder="Date"
        value={time}
        onChangeText={handleDateChange}
      />
       <Text style={
          {
            color: 'black',
            fontSize: 24,
            fontWeight: 400,
            marginTop: 20,
            // marginBottom: 4,
          }
        }
      >Items</Text>
      <TouchableOpacity
        onPress={handleAddItem}
        style={styles.itemButton}>
        <Text style={styles.signInText}>Add Item</Text>
      </TouchableOpacity>
      {/* {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TextInput
            style={styles.itemInput}
            placeholder="Item"
            value={item.item}
            onChangeText={text => handleItemChange(text, index, 'item')}
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Price"
            value={item.price.toString()}
            onChangeText={text => handleItemChange(text, index, 'price')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Quantity"
            value={item.quantity.toString()}
            onChangeText={text => handleItemChange(text, index, 'quantity')}
            keyboardType="numeric"
          />
          {index > 0 && (
            <Button
              title="Remove"
              onPress={() => handleRemoveItem(index)}
              color="red"
            />
          )}
        </View>
      ))} */}
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
            <CTextInput
              label="Item name"
              placeholder="Name"
              value={item.item}
              onChangeText={text => handleItemChange(text, index, 'item')}
            />
            <CTextInput
              label="Price"
              placeholder="Price"
              value={item.price.toString()}
              onChangeText={text => handleItemChange(text, index, 'price')}
              keyboardType="numeric"
            />
            <CTextInput
              label="Quantity"
              placeholder="Quantity"
              value={"1"}
              // value={item.quantity.toString()}
              onChangeText={text => handleItemChange(text, index, 'quantity')}
              keyboardType="numeric"
            />
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          {/* {index > 0 && (
            <Button
              title="Remove"
              onPress={() => handleRemoveItem(index)}
              color="red"
            />
          )} */}
        </View>
      ))}
      {/* <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Total</Text>
        <TextInput
          style={styles.input}
          placeholder="Total"
          value={total.toString()}
          onChangeText={handleTotalChange}
          keyboardType="numeric"
        />
      </View> */}
       <CTextInput
              label="Total"
              placeholder="Total"
              value={total.toString()}
              onChangeText={handleTotalChange}
              keyboardType="numeric"
            />

<TouchableOpacity
        onPress={handleSubmit}
        style={styles.signInButton}>
        <Text style={styles.signInText}>Submit</Text>
      </TouchableOpacity>

      {/* <DemoButton key="Submit" onPress={handleSubmit}>
        {'Submit'}
      </DemoButton> */}
      </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 4,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heroImage: {
    resizeMode: 'contain',
    height: 200,
  },
  forgotPasswordText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  content: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: theme.colors.textLight,
    borderRadius: theme.spacing.m,
    paddingLeft: theme.spacing.m,
  },
  formInputLabel: {
    paddingLeft: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  formInputGroup: {
    marginBottom: theme.spacing.l,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.themeVDark,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 10,
  },
  itemButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.themeDark,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
  },
  signInText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textLight,
    fontWeight: 800,
  },
  backIcon: {
    marginTop: 5,
  },
});

// const styles = StyleSheet.create({
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   itemsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   itemsText: {
//     marginRight: 8,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   itemInput: {
//     flex: 1,
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingHorizontal: 8,
//   },
//   fieldContainer: {
//     marginBottom: 16,
//   },
//   fieldTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
// });
