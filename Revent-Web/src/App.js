import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import "./App.css";

const theme = {
  entertainmentBg: "#F6C6FA",
  foodBg: "#F3FADC",
  shoppingBg: "#FFEB5B",
  groceryBg: "#B1D4E0",
  othersBg: "#F4C5CC",
};

const Receipt = () => {
  const { documentName } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [iconImage, setIconImage] = useState("others.png");

  const fetchReceipt = async (documentName) => {
    const docRef = doc(db, "receipts", documentName);
    const docSnapshot = await getDoc(docRef);
    console.log(docSnapshot);

    if (docSnapshot.exists()) {
      const receiptData = docSnapshot.data();
      await setReceipt(receiptData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receipt) {
      document.body.style.backgroundColor = theme[`${receipt.type}Bg`];
      switch (receipt.type) {
        case "food":
          // imageSource = require('../assets/images/food.png');
          setIconImage(process.env.PUBLIC_URL + "/food.png");
          break;
        case "entertainment":
          // imageSource = require('../assets/images/entertainment.png');
          setIconImage(process.env.PUBLIC_URL + "/entertainment.png");
          break;
        case "grocery":
          // imageSource = require('../assets/images/grocery.png');
          setIconImage(process.env.PUBLIC_URL + "/grocery.png");
          break;
        case "shopping":
          // imageSource = require('../assets/images/shopping.png');
          setIconImage(process.env.PUBLIC_URL + "/shopping.png");
          break;
        default:
          // imageSource = require('../assets/images/others.png');
          setIconImage(process.env.PUBLIC_URL + "/others.png");
          break;
      }
    }
  }, [receipt]);

  // //method to convert time to AM PM format
  // function tConvert(time) {
  //   time = time
  //     .toString()
  //     .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  //   if (time.length > 1) {
  //     time = time.slice(1); // Remove full string match value
  //     time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
  //     time[0] = +time[0] % 12 || 12; // Adjust hours
  //   }
  //   return time.join("");
  // }

  // //method to convert data to dd-mm-yyyy  format
  // const dateFormat = (datex) => {
  //   let t = new Date(datex * 1000);
  //   const date = ("0" + t.getDate()).slice(-2);
  //   const month = ("0" + (t.getMonth() + 1)).slice(-2);
  //   const year = t.getFullYear();
  //   const hours = ("0" + t.getHours()).slice(-2);
  //   const minutes = ("0" + t.getMinutes()).slice(-2);
  //   const seconds = ("0" + t.getSeconds()).slice(-2);
  //   const time = tConvert(`${hours}:${minutes}:${seconds}`);
  //   const newDate = `${date}-${month}-${year}, ${time}`;

  //   return newDate;
  // };

  useEffect(() => {
    fetchReceipt(documentName);
  }, [documentName]);

  return (
    <div className='app'>
      {!loading && (
        <div className='content-container'>
          <div className='receipt-container'>
            <div className='header-group'>
              <div>
                <img className='catIcon' src={iconImage} alt='' />
              </div>
              <div className='title'>{receipt.company}</div>
              <div className='normalText'>{receipt.location}</div>
              <div className='normalText'>{receipt.time}</div>
            </div>
            <div className='body-group'>
              {receipt.items.map((item, index) => (
                <div key={index} className='orderItemContainer'>
                  <div className='normalText'>{item.quantity}</div>
                  <div className='normalText'>{item.item}</div>
                  <div className='normalText'>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className='amountContainer'>
              <div className='normalText'>
                Total: ${receipt.total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className='app-download-group'>
            <div className='normalText'>Want to save your receipts?</div>
            <div className='normalText'>Download the Revent app today!</div>
            <img className='google' src='/google-play-badge.png' alt='' />
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route exact path='/:documentName' element={<Receipt />} />
    </Routes>
  </Router>
);

export default App;
