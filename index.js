const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.staffAdded = functions.firestore.document('staff/{staffId}').onCreate((snap, context) =>{
  console.info('A new staff member was added');
})

exports.staffUpdated = functions.firestore.document('staff/{staffId}')
.onUpdate((snap,context) => {
  const oldValue = snap.before.data();
  const newValue = snap.after.data();

  console.log('old:',oldValue);
  console.log('new:', newValue);

  return snap.after.ref.set({
    comment:'Document updated successfully'
  },{merge:true});
});

exports.staffDeleted = functions.firestore.document('staff/{staffId}')
.onDelete((snap,context) => {
  console.info('New staff has been added');
});

exports.staffChanged = functions.firestore.document('staff/{staffId}')
.onWrite((snap,context) => {
  console.info('New staff has been added');
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// https://us-central1-my-functions-b16fa.cloudfunctions.net/helloWorld -->created function
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   //functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addPerson = functions.https.onCall((data, context) => {
  firstName = data.firstName;
  lastName = data.lastName;

  return admin
    .database()
    .ref("/person")
    .push({
      firstName,
      lastName,
      fullName: firstName + " " + lastName,
    })
    .then(() => {
      console.log("new Person added");
      return "Ok";
    })
    .catch((error) => {
      throw new functions.https.HttpsError("unknown", error.message, error);
    });
});

exports.date = functions.https.onRequest((req, res)=>{
  if(req.method !== 'GET'){
    return res.status(403).send('forbidden');
  }

  const date = new Date();
  const snapshot = admin.database().ref('/dates').push({
    now:date.toDateString()
  });
  res.redirect(303, snapshot.ref.toString())
  res.send(date.toDateString());
});