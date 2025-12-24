// =====================================================
// auth_guard.js
// Purpose:
// - Protect role-based pages
// - Fix auth / Firestore timing race condition
// - Do NOT weaken security
// =====================================================

import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Small helper: wait for N milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------
// Main guard
// role: required role string (e.g. "doctor", "admin")
// onSuccess: callback(profileData)
// -----------------------------------------------------
export function requireAuth(role, onSuccess) {

  onAuthStateChanged(auth, async (user) => {

    // 1️⃣ Not logged in → go to login
    if (!user) {
      location.href = "/index.html";
      return;
    }

    const userRef = doc(db, "users", user.uid);

    // 2️⃣ Try to read user document (first attempt)
    let snap = null;

    try {
      snap = await getDoc(userRef);
    } catch (err) {
      // Firestore not ready yet (network / rules cache)
      snap = null;
    }

    // 3️⃣ If doc not available yet → wait briefly and retry ONCE
    if (!snap || !snap.exists()) {
      await sleep(300); // short, safe delay

      try {
        snap = await getDoc(userRef);
      } catch (err) {
        snap = null;
      }
    }

    // 4️⃣ Still no user doc → invalid session
    if (!snap || !snap.exists()) {
      await signOut(auth);
      location.href = "/index.html";
      return;
    }

    const profile = snap.data();

    // 5️⃣ Role check
    if (role && profile.role_id !== role) {
      await signOut(auth);
      location.href = "/index.html";
      return;
    }

    // 6️⃣ Status check (if present)
    if (profile.status && profile.status !== "active") {
      await signOut(auth);
      location.href = "/index.html";
      return;
    }

    // 7️⃣ Approval check (if present)
    if (profile.approved === false) {
      // Allowed to stay logged in, but no access
      // Page can show "Pending approval"
      onSuccess(profile);
      return;
    }

    // 8️⃣ All checks passed
    onSuccess(profile);
  });
}
