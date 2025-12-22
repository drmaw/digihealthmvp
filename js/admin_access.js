/* =====================================================
   DigiHealth – Admin Access & Helpers
   File: /js/admin_access.js
===================================================== */

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

/* ---------------------------------
   Admin role check
---------------------------------- */

export function isAdmin(user) {
  return user?.role_id === "admin";
}

/* ---------------------------------
   Fetch system role statistics
---------------------------------- */

export async function getRoleStatistics() {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  const stats = {
    total: 0,
    patient: 0,
    doctor: 0,
    clinic_manager: 0,
    assistant_manager: 0,
    representative: 0,
    admin: 0
  };

  snap.forEach(doc => {
    const u = doc.data();
    stats.total++;
    if (stats[u.role_id] !== undefined) {
      stats[u.role_id]++;
    }
  });

  return stats;
}

/* ---------------------------------
   Fetch recently created users
---------------------------------- */

export async function getRecentUsers(limit = 20) {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  const users = [];
  snap.forEach(doc => {
    users.push({ uid: doc.id, ...doc.data() });
  });

  return users
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, limit);
}

/* ---------------------------------
   Fetch pending approvals
---------------------------------- */

export async function getPendingDoctorApprovals() {
  const q = query(
    collection(db, "users"),
    where("role_id", "==", "doctor"),
    where("approved", "==", false)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function getPendingOrganizations() {
  const q = query(
    collection(db, "organizations"),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
