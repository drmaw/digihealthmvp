/* =========================================================
   DigiHealth — Authentication & Role Guard
   File: js/auth.js
   ========================================================= */

import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================================================
   Get logged-in user + profile
   ========================================================= */
export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return null;

  return {
    uid: user.uid,
    ...snap.data()
  };
}

/* =========================================================
   Require authentication only
   ========================================================= */
export function requireAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/index.html";
      return;
    }
    callback(user);
  });
}

/* =========================================================
   Require authentication + allowed roles
   Example:
   requireRole(["doctor","admin"], (profile)=>{})
   ========================================================= */
export function requireRole(allowedRoles, callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/index.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      await signOut(auth);
      window.location.href = "/index.html";
      return;
    }

    const profile = snap.data();

    if (!allowedRoles.includes(profile.role_id)) {
      window.location.href = "/index.html";
      return;
    }

    callback({
      uid: user.uid,
      ...profile
    });
  });
}

/* =========================================================
   Logout helper
   ========================================================= */
export async function logout() {
  await signOut(auth);
  window.location.href = "/index.html";
}
