// firebase.config.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDQFVMVSPPlXESs__t7D7DMEwrFWpPMVpc",
  authDomain: "proyectofinal-web-42f3b.firebaseapp.com",
  projectId: "proyectofinal-web-42f3b",
  storageBucket: "proyectofinal-web-42f3b.appspot.com",
  messagingSenderId: "904328738986",
  appId: "1:904328738986:web:d516f95d81bf4dcea9f8d3",
  measurementId: "G-QN169PDZSM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

module.exports = { db };