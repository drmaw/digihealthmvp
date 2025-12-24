// js/auth.js
// --------------------------------------------------
// Central authentication & user-profile loader
// Beginner-readable, explicit, and safe
// --------------------------------------------------

import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --------------------------------------------------
// Global state (simple & explicit)
// --------------------------------------------------
export let currentUser = null;
export let currentUserProfile = null;

// --------------------------------------------------
// Listen to auth state
// --------------------------------------------------
export function initAuth(required = true) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {

      // -----------------------------
      // Not logged in
      // -----------------------------
      if (!user) {
        currentUser = null;
        currentUserProfile = null;

        if (required) {
          window.location.href = "/index.html";
        }
        return resolve(null);
      }

      // -----------------------------
      // Logged in
      // -----------------------------
      currentUser = user;

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        // ---------------------------------
        // CRITICAL SAFETY CHECK
        // ---------------------------------
        if (!snap.exists()) {
          alert(
            "Your account is not fully set up yet.\n" +
            "Please contact admin."
          );
          await signOut(auth);
          window.location.href = "/index.html";
          return;
        }

        currentUserProfile = snap.data();
        resolve(currentUserProfile);

      } catch (err) {
        console.error("Auth init failed:", err);
        alert("Authentication error. Please try again.");
        await signOut(auth);
        window.location.href = "/index.html";
      }
    });
  });
}

// --------------------------------------------------
// Simple role helpers (readable)
// --------------------------------------------------
export function hasRole(roleName) {
  if (!currentUserProfile) return false;
  return currentUserProfile.role_id === roleName;
}

export function isAdmin() {
  return hasRole("admin");
}

export function isDoctor() {
  return hasRole("doctor");
}

export function isPatient() {
  return hasRole("patient");
}

export function isRepresentative() {
  return hasRole("representative");
}

// --------------------------------------------------
// Logout helper
// --------------------------------------------------
export async function logout() {
  await signOut(auth);
  window.location.href = "/index.html";
}
