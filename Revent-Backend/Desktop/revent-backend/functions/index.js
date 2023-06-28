/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// APP API

// http callable function, context is auth status
exports.callableTest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "only authenticated users can add receipts",
    );
  }
  // use the return function to return the response, no response object
  return "hello fat boi";
});

// UPDATE SPENDINGS OF USER (firestore users receipt onUpdate trigger)
exports.updateSpendingRecord = functions.firestore
    .document("/users/{id}")
    .onUpdate(async (change, context) => {
      // get user's receipt added, identify category & receiptTotal & time
      // NEED TO COMPARE, if receipts after > before then execute
      const oldUser = change.after.data();
      const updatedUser = change.after.data();
      if (updatedUser.receipts.length - oldUser.receipts.length == 1) {
        const newReceiptId = updatedUser.receipts.slice(-1)[0];
        console.log("receipt id: ", newReceiptId);
        const receiptDoc = admin.firestore().collection("receipts")
            .doc(newReceiptId);
        const receiptSnap = await receiptDoc.get();
        console.log("receipt: ", receiptSnap.data());
        // take time -> identify month and day
        const category = receiptSnap.data().type;
        const receiptTotal = receiptSnap.data().total;
        // [UNDONE] get month
        const month = 1;
        console.log("category, total, month: ", category, receiptTotal, month);
        // const month = receiptSnap.type.month;
        // get user's original monthly total and category
        console.log("spendings record id: ", updatedUser.spendings);
        const spendingRef = admin.firestore().collection("spendings")
            .doc(updatedUser.spendings);
        // update user's monthly total and category
        const categoryPath = "" + month + ".categories." + category;
        const totalPath = "" + month + ".total";
        const spendingDoc = await spendingRef.get();
        const spendingSnap = spendingDoc.data();
        console.log("spending record: ", spendingSnap);
        const originalTotal = spendingSnap[month].total;
        const originalCatTotal = spendingSnap[month].categories[category];
        console.log("original total, cat:", originalTotal, originalCatTotal);
        return spendingRef.update({
          [totalPath]: originalTotal + receiptTotal,
          [categoryPath]: originalCatTotal + receiptTotal,
        });
      } else {
        return null;
      }
    });

// GENERATE AND ADD SPENDING RECORD TO USER (callable function)
exports.addSpendingRecord = functions.https.onCall(async (data, context) => {
  const id = context.auth.uid;
  // const dayRecord = {
  //   total: 0,
  //   categories: {
  //     food: 0,
  //     entertainment: 0,
  //     grocery: 0,
  //     shopping: 0,
  //     others: 0,
  //   },
  // };
  const monthRecord = {
    total: 0,
    categories: {
      food: 0,
      entertainment: 0,
      grocery: 0,
      shopping: 0,
      others: 0,
    },
  };
  const yearRecord = {
    user: id,
    year: "2023",
    1: monthRecord,
    2: monthRecord,
    3: monthRecord,
    4: monthRecord,
    5: monthRecord,
    6: monthRecord,
    7: monthRecord,
    8: monthRecord,
    9: monthRecord,
    10: monthRecord,
    11: monthRecord,
    12: monthRecord,
  };
  const spendRef = await admin.firestore().collection("spendings")
      .add(yearRecord);
  return admin.firestore().collection("users").doc(id).set({
    spendings: spendRef._path.segments[1],
  }, {merge: true});
});

// DELETE USER FROM DB (auth onDelete trigger)
exports.userDeleted = functions.auth.user().onDelete(async (user) => {
  // for background triggers you must return a value/promise
  const userDoc = admin.firestore().collection("users").doc(user.uid);
  const spendingId = await userDoc.get().data().spendings;
  await admin.firestore().collection("spendings").doc(spendingId).delete();
  return userDoc.delete();
});

// LOG ALL ACTIVITIES (firestore onCreate trigger)
exports.logActivities = functions.firestore
    .document("/{collection}/{id}")
    .onCreate((snap, context) => {
      // context includes information about the path
      // snapshot of the document created
      // .collection grabs the wildcard from the document path
      console.log(snap.data());
      const collection = context.params.collection;
      // const id = context.params.id;
      // add activities to firestore
      const activities = admin.firestore.collection("activities");
      if (collection === "receipts") {
        return activities.add({text: "new receipt was added"});
      }
      if (collection === "users") {
        return activities.add({text: "a new user signed up"});
      }
      return null;
    });

// HARDWARE API

// // TEST FUNCTION (http)
// exports.httpTest = functions.https.onRequest((req, res) => {
//   // use response object to send a response back to client
//   res.send("https://revent-eco.firebaseapp.com/");
// });

// ADD RECEIPT (http)
exports.addReceipt = functions.https.onRequest(async (req, res) => {
  try {
    const receiptDetails = req.body;
    const receiptRef = admin.firestore().collection("receipts");
    const addResponse = await receiptRef.add(receiptDetails);
    const receiptId = addResponse._path.segments[1];
    res.send("revent-eco.web.app/" + receiptId);
  } catch (error) {
    res.send("fail: ", error);
  }
});

// // ADD RECEIPT FROM APP (callable function)
// exports.callableReceipt = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//         "unauthenticated",
//         "only authenticated users can add receipts",
//     );
//   }
//   return admin.firestore().collection("receipts").add({
//     store: data.store,
//     item: data.item,
//     price: data.price,
//   });
// });

// // async await example
// exports.upvote = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//         "unauthenticated",
//         "only authenticated users can add receipts",
//     );
//   }
//   // get data for user doc and receipt doc
//   const user = admin.firestore().collection("users").doc(context.auth.uid);
//   const request = admin.firestore().collection("requests").doc(data.id);

//   const doc = await user.get();

//   if(doc.data().upvotedOn.includes(data.id)){
//     throw new functions.https.HttpsError(
//       "failed",
//       "you can only upvote once"
//     );
//   }
//   await user.update({
//     upvotedOn: [...doc.data().upvotedOn, data.id]
//   });
//   return request.update({
//     upvotes: admin.firestore.FieldValue.increment(1),
//   })
// })


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
