
//const initializeApp = require("firebase/app");
import {initializeApp} from "firebase/app";
import {getFirestore,collection,addDoc, getDocs} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDr4JEqLaoVAKe0LNC_0W1j1lofUHF5Hvo",
  authDomain: "mootiparameter.firebaseapp.com",
  projectId: "mootiparameter",
  storageBucket: "mootiparameter.appspot.com",
  messagingSenderId: "783428209311",
  appId: "1:783428209311:web:d5f10a38493196ac6170aa"
};

// Initialize Firebase
const firestoreApp =  initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);


export {
  db,
  
};