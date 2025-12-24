import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

/*
  initAuth(required)
  - required = true → must be logged in
  - returns user profile (Firestore)
*/
export async function initAuth(required = false) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (required) {
          window.location.href = "/index.html";
        }
        resolve(null);
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("User profile missing");
          resolve(null);
          return;
        }

        const profile = snap.data();

        // 🔒 SINGLE INACTIVE CHECK (ONLY PLACE)
        if (profile.approved !== true || profile.status !== "active") {
          alert("Account inactive");
          resolve(null);
          return;
        }

        // attach uid for convenience
        profile.uid = user.uid;

        resolve(profile);

      } catch (err) {
        console.error("Auth init failed", err);
        alert("Authentication error");
        resolve(null);
      }
    });
  });
}
