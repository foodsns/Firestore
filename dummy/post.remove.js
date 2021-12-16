var admin = require("firebase-admin");
const firebase = require('@firebase/testing')

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mogutsou-default-rtdb.asia-southeast1.firebasedatabase.app"
});

admin.firestore().collection("posts").where('title', '==', 'dummy')
.get().then(result => {
    console.log(result.docs.length)
    result.docs.forEach(doc => {
        admin.firestore().collection("posts").doc(doc.id).delete()
    })
})
.catch(err => {
    console.log('err', err)
})