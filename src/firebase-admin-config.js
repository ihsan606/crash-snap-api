const admin = require('firebase-admin');
const serviceAccount = require('./../google-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "capstone-crashsnap.appspot.com"
});

module.exports = admin;