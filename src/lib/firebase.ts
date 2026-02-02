// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2vpFUJEKc7wZW0veMmgKB-oH6dl5KFng",
  authDomain: "flextranslator.firebaseapp.com",
  projectId: "flextranslator",
  storageBucket: "flextranslator.firebasestorage.app",
  messagingSenderId: "1068086577831",
  appId: "1:1068086577831:web:880e6c675eef7c6b38a982",
  measurementId: "G-WDJG1B0CYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
