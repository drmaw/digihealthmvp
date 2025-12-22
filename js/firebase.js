/* =========================================================
   DigiHealth — Firebase Initialization
   File: js/firebase.js
   Purpose:
   - Initialize Firebase ONCE
   - Export shared instances for the entire app
   - No auth logic, no redirects here
   ========================================================= */

/* Firebase SDKs (ES Modules) */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* =========================================================
   Firebase Configuration
   NOTE:
   - Keep keys here only
   - Do NOT duplicate this config in any HTML file
   ========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyBqUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.appspot.com",
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051"
};

/* =========================================================
   Initialize Firebase App
   ========================================================= */
const app = initializeApp(firebaseConfig);

/* =========================================================
   Shared Firebase Services
   ========================================================= */
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* =========================================================
   Exports
   - Import these from any page or module
   - Example:
   - import { auth, db } from "/js/firebase.js";
   ========================================================= */
export { app, auth, db, storage };
