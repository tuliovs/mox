// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.aggregateCards = functions.database.ref('/cards')
//   .onWrite((event) => {
//     admin.firestore().collection('aggregated-data').doc('mox-data')
//       .get()
//       .then(
//         (data) => {
//           const aggreCollection = admin.firestore().collection('aggregated-data');
//           if (data.total_cards > 0 ) {
//             const doc = {
//               total_cards: data.total_cards + 1
//             }
//             aggreCollection.doc('mox-data').update(doc);
//           } else {
//             admin.firestore().collection('cards').
//             get()
//             .then(
//               (querySnap) => {
//                 const cardTotal = querySnap.size;
//                 const doc = {
//                   total_cards: cardTotal
//                 }
//                 aggreCollection.doc('mox-data').update(doc);
//               }
//             );
//           }
//         }
//       );
//   });
