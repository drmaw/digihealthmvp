// clinic/clinic.js
// Shared clinic logic for manager & assistant_manager

import { auth, db } from "../js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* -------------------- AUTH GUARD -------------------- */

export async function requireClinicUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        location.href = "/index.html";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        location.href = "/index.html";
        return;
      }

      const profile = snap.data();

      if (
        profile.role_id !== "clinic_manager" &&
        profile.role_id !== "assistant_manager"
      ) {
        location.href = "/index.html";
        return;
      }

      if (!profile.organization_id) {
        alert("Organization not assigned");
        location.href = "/index.html";
        return;
      }

      resolve({ user, profile });
    });
  });
}

/* -------------------- SEARCH USER -------------------- */

export async function searchUserGlobal(input) {
  input = input.trim();
  if (!input) return null;

  let q;

  // DigiHealth ID (10 digits)
  if (/^\d{10}$/.test(input)) {
    q = query(
      collection(db, "users"),
      where("digihealth_id", "==", input)
    );
  }
  // Bangladesh phone
  else if (/^01\d{9}$/.test(input)) {
    q = query(
      collection(db, "users"),
      where("mobile", "==", input)
    );
  } else {
    return null;
  }

  const snap = await getDocs(q);
  if (snap.empty) return null;

  return snap.docs.map(d => ({
    uid: d.id,
    ...d.data()
  }));
}

/* -------------------- STAFF ASSIGNMENT -------------------- */

export async function assignStaffToOrganization(staffUid, orgId, role) {
  await updateDoc(doc(db, "users", staffUid), {
    organization_id: orgId,
    organization_role: role,
    assigned_at: serverTimestamp()
  });
}

/* -------------------- APPOINTMENTS -------------------- */

export async function createClinicAppointment(data) {
  return await addDoc(collection(db, "appointments"), {
    patient_uid: data.patient_uid,
    doctor_uid: data.doctor_uid || null,
    organization_id: data.organization_id,
    scheduled_at: data.scheduled_at,
    status: "requested",
    created_by_uid: data.created_by_uid,
    created_by_role: data.created_by_role,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
}

export async function listClinicAppointments(orgId) {
  const q = query(
    collection(db, "appointments"),
    where("organization_id", "==", orgId)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function updateAppointmentStatus(appointmentId, status) {
  await updateDoc(doc(db, "appointments", appointmentId), {
    status,
    updated_at: serverTimestamp()
  });
}

/* -------------------- CLINIC STATS -------------------- */

export async function getClinicStats(orgId) {
  const q = query(
    collection(db, "appointments"),
    where("organization_id", "==", orgId)
  );

  const snap = await getDocs(q);

  let stats = {
    total: 0,
    requested: 0,
    confirmed: 0,
    appointed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0
  };

  snap.forEach(doc => {
    const s = doc.data().status;
    stats.total++;
    if (stats[s] !== undefined) stats[s]++;
  });

  return stats;
}
