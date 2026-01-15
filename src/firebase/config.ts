// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnQqKEXGPAMc4Jtz0sPSnFnncB5a7oprM",
  authDomain: "paws-9cd41.firebaseapp.com",
  projectId: "paws-9cd41",
  storageBucket: "paws-9cd41.appspot.com",
  messagingSenderId: "137802784157",
  appId: "1:137802784157:web:7d51c3b412a9fafee66374"
};

// Initialize Firebase
export const getFirebaseApp = () => {
    if (getApps().length) {
        return getApps()[0];
    }
    return initializeApp(firebaseConfig);
}
