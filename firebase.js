// firebase.js
// DigiHealth MVP — Firebase initialization (Frontend only)

// -------------------- IMPORTS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// -------------------- CONFIG --------------------
const firebaseConfig = {
  apiKey: "AIzaSyBqUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.appspot.com",
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051",
  measurementId: "G-DN04T17GY9"
};

// -------------------- INIT --------------------
const app = initializeApp(firebaseConfig);

// Analytics (safe to keep)
const analytics = getAnalytics(app);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------- EXPORTS --------------------
export {
  app,
  analytics,
  auth,
  db,
  serverTimestamp
};
