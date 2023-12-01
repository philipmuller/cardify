// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDKe7FbT8UhpGQ6GX6cBEEBgxulKRCJx60",
    authDomain: "cardify-5fc3e.firebaseapp.com",
    projectId: "cardify-5fc3e",
    storageBucket: "cardify-5fc3e.appspot.com",
    messagingSenderId: "559210062928",
    appId: "1:559210062928:web:5c5c4fcfd2b9e8724a1d55",
    measurementId: "G-SC1XKEMWES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const db = getFirestore(app);

export const auth = getAuth(app);
//export {db};


//export default function() { <>Nothing is here!</> }

