
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (corrected)
const firebaseConfig = {
  apiKey: "AIzaSyBqUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.appspot.com", // ✅ FIXED
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exports
export { app, auth, db, storage };
