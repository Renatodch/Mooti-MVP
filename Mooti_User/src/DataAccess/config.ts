
//const initializeApp = require("firebase/app");
import {initializeApp} from "firebase/app";
import {getFirestore,collection,addDoc, getDocs} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUTrrZFyI46tryBFE3tknAKVb_VF0qd0U",
  authDomain: "mooti-user.firebaseapp.com",
  projectId: "mooti-user",
  storageBucket: "mooti-user.appspot.com",
  messagingSenderId: "353056042468",
  appId: "1:353056042468:web:99d59f77f51595fa926bf1"
};

// Initialize Firebase
const firestoreApp =  initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);

export {
  db,
};