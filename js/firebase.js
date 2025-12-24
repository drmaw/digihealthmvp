// js/firebase.js
// --------------------------------------------------
// Single source of truth for Firebase initialization
// Beginner-safe, explicit, and predictable
// --------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// --------------------------------------------------
// Firebase configuration (YOUR EXISTING PROJECT)
// --------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBqUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.firebasestorage.app",
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051",
  measurementId: "G-DN04T17GY9"
};

// --------------------------------------------------
// Initialize Firebase ONCE
// --------------------------------------------------
const app = initializeApp(firebaseConfig);

// --------------------------------------------------
// Export Firebase services
// --------------------------------------------------
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --------------------------------------------------
// NOTE FOR FUTURE YOU:
// Import ONLY from this file.
// Never initialize Firebase anywhere else.
// --------------------------------------------------
