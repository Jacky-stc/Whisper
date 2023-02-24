// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU50Q9RGTo4vM6fSF5qRNt1wfs6aDrWaA",
  authDomain: "whisper-ea7d9.firebaseapp.com",
  projectId: "whisper-ea7d9",
  storageBucket: "whisper-ea7d9.appspot.com",
  messagingSenderId: "116162401176",
  appId: "1:116162401176:web:89a72702dbd96cdc2611ed",
  measurementId: "G-JBQEVBMS3Q",
  databaseURL:
    "https://whisper-ea7d9-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
