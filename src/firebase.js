import firebase from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/firebase-auth'
import 'firebase/storage'
var firebaseConfig = {
  apiKey: "AIzaSyBeB55Zk-k-wtxW-_A6De0IjvBWc2JixNg",
  authDomain: "sitesms-d82dc.firebaseapp.com",
  projectId: "sitesms-d82dc",
  storageBucket: "sitesms-d82dc.appspot.com",
  messagingSenderId: "472534856340",
  appId: "1:472534856340:web:753c36d49a5f904fabba81"
};
  // Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export { fb, db }