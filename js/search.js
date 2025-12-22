/* =========================================================
   DigiHealth — Unified Search
   File: /js/search.js
   ---------------------------------------------------------
   • Search by DigiHealth ID or mobile
   • Privacy-safe (no leakage)
   • Uses access_control.js ONLY for permissions
   ========================================================= */

import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  canViewProfile
} from "./access_control.js";

/* =========================================================
   Helpers
   ========================================================= */

function isDigiHealthId(value) {
  return /^\d{10}$/.test(value);
}

function isMobile(value) {
  return /^01\d{9}$/.test(value);
}

/* =========================================================
   Main search function
   ---------------------------------------------------------
   viewer = logged-in user object
   input  = DigiHealth ID or mobile
   Returns:
     - null (not found / not allowed)
     - { uid, ...userData }
   ========================================================= */

export async function searchUser(viewer, input) {
  if (!viewer || !input) return null;

  const key = input.trim();
  if (!key) return null;

  let q = null;
  const usersRef = collection(db, "users");

  if (isDigiHealthId(key)) {
    q = query(
      usersRef,
      where("health_id_10", "==", key),
      limit(1)
    );
  }
  else if (isMobile(key)) {
    q = query(
      usersRef,
      where("mobile", "==", key),
      limit(1)
    );
  }
  else {
    return null;
  }

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const docSnap = snap.docs[0];
  const targetUser = {
    uid: docSnap.id,
    ...docSnap.data()
  };

  /* =====================================================
     FINAL PERMISSION CHECK (CRITICAL)
     -----------------------------------------------------
     Even if found in Firestore, we MUST check access
     ===================================================== */

  if (!canViewProfile(viewer, targetUser)) {
    return null; // privacy-safe: looks like "not found"
  }

  return targetUser;
}
