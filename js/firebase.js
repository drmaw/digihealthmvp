// /js/firebase.js
// DigiHealth — Firebase Initialization (SINGLE SOURCE OF TRUTH)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔐 Firebase config (DO NOT DUPLICATE ANYWHERE ELSE)
const firebaseConfig = {
  apiKey: "AIzaSyBQUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.appspot.com",
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Core services (export ONLY these)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🚫 Do NOT export app, config, or re-initialize elsewhere
export { auth, db, storage };
