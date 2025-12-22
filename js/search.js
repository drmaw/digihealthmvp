// =======================================================
// DigiHealth — Global User Search Utility
// File: /js/search.js
// Supports search by:
//   - DigiHealth ID (10 digits)
//   - Mobile number (Bangladesh)
// Enforces role + organization-based access
// =======================================================

import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/*
  viewer = {
    uid,
    role_id,
    organization_id
  }
*/

export async function searchUser(input, viewer) {
  if (!viewer || !viewer.role_id) return null;

  input = input.trim();
  if (!input) return null;

  const usersRef = collection(db, "users");
  let filters = [];

  // 🔒 Organization restriction
  // Admin + Doctor → global
  // Manager / Assistant / Staff → own organization only
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager" ||
    viewer.role_id === "staff"
  ) {
    if (!viewer.organization_id) return null;
    filters.push(
      where("organization_id", "==", viewer.organization_id)
    );
  }

  // 🔍 DigiHealth ID (10 digits)
  if (/^\d{10}$/.test(input)) {
    filters.push(where("health_id_10", "==", input));
  }
  // 📱 Bangladesh mobile number
  else if (/^01\d{9}$/.test(input)) {
    filters.push(where("mobile", "==", input));
  }
  else {
    return null;
  }

  const q = query(usersRef, ...filters, limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docSnap = snap.docs[0];

  return {
    uid: docSnap.id,
    ...docSnap.data()
  };
}
