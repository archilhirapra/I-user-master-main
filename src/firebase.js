// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJMBnxsXhXPky2lTiOILE3NeVjJJ_DRSQ",
  authDomain: "deluxe-cleaners.firebaseapp.com",
  projectId: "deluxe-cleaners",
  storageBucket: "deluxe-cleaners.appspot.com",
  messagingSenderId: "644328501932",
  appId: "1:644328501932:web:d460c1f0be553dfbbc6509",
  measurementId: "G-341PFR9WMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const ourGoogleAuth = getAuth();