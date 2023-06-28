import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore/lite';
import {httpsCallable} from 'firebase/functions';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {db, functions} from '../Firebase/firebase';

const ReceiptTest = ({user}) => {
  const shop = 'My Store';
  const location = '123 Main St, Anytown USA';
  const time = '2023-05-11T14:30:00';
  const items = [
    {quantity: 2, name: 'Product A', price: 9.99},
    {quantity: 1, name: 'Product B', price: 14.99},
    {quantity: 3, name: 'Product C', price: 5.99},
  ];
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const [store, setStore] = React.useState('');
  const [item, setItem] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // // add Receipt using Cloud Functions
  // const addReceipt = async () => {
  //   try {
  //     const addReceiptFn = httpsCallable(functions, 'addReceipt');
  //     await addReceiptFn({store, item, price});
  //     console.log("receipt successfully added");
  //     setStore('');
  //     setItem('');
  //     setPrice('');
  //     setErrorMessage('');
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //   }
  // };

  // add Receipt directly with Firestore
  const addReceipt = async () => {
    // MAP INPUTS FROM NFC INTO THIS RECEIPT FORMAT
    const receiptFormat = {
      company: 'Company Name',
      items: [{item: 'Product A', price: 20, quantity: 5}],
      location: '50 Nanyang Ave, 639798',
      time: '14 May 2023 00:00:00 UTC+8',
      total: '100',
    };

    try {
      // add new receipt to receipts collection
      const receiptCol = collection(db, 'receipts');
      // const receiptRef = await addDoc(receiptCol, receiptFormat);
      // ^ use this line instead of the line below once can map all the info to the format above
      const receiptRef = await addDoc(receiptCol, {
        store: store,
        item: item,
        price: price,
      });
      // add the uid of receipt to belong to user
      const userRef = doc(db, 'users', user);
      console.log(userRef);
      await updateDoc(userRef, {
        receipts: arrayUnion(receiptRef.id),
      });
      console.log('receipt successfully added');
      setStore('');
      setItem('');
      setPrice('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.shop}>{shop}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.itemList}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.temp}>
        <Button
          title="Cloud Functions Test"
          onPress={() => {
            const sayHello = httpsCallable(functions, 'sayHello');
            sayHello().then(result => {
              console.log(result.data);
            });
          }}
        />
      </View>
      <View style={styles.temp}>
        <Text style={styles.heading}>Add Receipt</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Store Name"
          value={store}
          onChangeText={value => setStore(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={item}
          onChangeText={value => setItem(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          keyboardType="numeric"
          onChangeText={value => setPrice(value)}
        />
        <TouchableOpacity style={styles.button} onPress={addReceipt}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    //make it center of screen
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '90%',
    height: '80%',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  shop: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    margin: 5,
  },
  time: {
    fontSize: 14,
    margin: 5,
  },
  itemList: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  temp: {
    margin: 10,
  },
});

export default ReceiptTest;
