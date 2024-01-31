
//const initializeApp = require("firebase/app");
import {initializeApp} from "firebase/app";
import {getFirestore,collection,addDoc, getDocs} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7tTFd9Dpp2QA8KzhYECnKNfdVCeCxngA",
  authDomain: "mooti-parameter.firebaseapp.com",
  projectId: "mooti-parameter",
  storageBucket: "mooti-parameter.appspot.com",
  messagingSenderId: "345511578190",
  appId: "1:345511578190:web:732cd4d3d93603beb4111f"
};

// Initialize Firebase
const firestoreApp =  initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);


export {
  db,
  
};