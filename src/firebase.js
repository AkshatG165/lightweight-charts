import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBxZ7ATstt2vDmU5mg8kt6jskwL_MvGXRY',
  authDomain: 'nifty-weekly-4c87a.firebaseapp.com',
  databaseURL:
    'https://nifty-weekly-4c87a-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'nifty-weekly-4c87a',
  storageBucket: 'nifty-weekly-4c87a.appspot.com',
  messagingSenderId: '984423849987',
  appId: '1:984423849987:web:918d85767e0d1ce229ee36',
  measurementId: 'G-BFT6L22HK6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
