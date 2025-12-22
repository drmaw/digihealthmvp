/* =====================================================
   DigiHealth – Record Access Controller
   File: /js/records_access.js
===================================================== */

import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";
import { canViewRecord } from "./permissions.js";

/* ---------------------------------
   Fetch records for a patient
---------------------------------- */

export async function getVisibleRecordsForPatient(viewer, patient_uid) {
  const recordsRef = collection(db, "patient_records");
  const q = query(recordsRef, where("patient_uid", "==", patient_uid));

  const snap = await getDocs(q);
  const visible = [];

  snap.forEach(docSnap => {
    const record = { id: docSnap.id, ...docSnap.data() };
    if (canViewRecord(viewer, record)) {
      visible.push(record);
    }
  });

  return visible;
}

/* ---------------------------------
   Fetch records for organization
---------------------------------- */

export async function getVisibleRecordsForOrganization(viewer) {
  if (!viewer.organization_id) return [];

  const recordsRef = collection(db, "patient_records");
  const q = query(recordsRef, where("organization_id", "==", viewer.organization_id));

  const snap = await getDocs(q);
  const visible = [];

  snap.forEach(docSnap => {
    const record = { id: docSnap.id, ...docSnap.data() };
    if (canViewRecord(viewer, record)) {
      visible.push(record);
    }
  });

  return visible;
}

/* ---------------------------------
   Fetch records created by user
---------------------------------- */

export async function getRecordsCreatedByUser(viewer) {
  const recordsRef = collection(db, "patient_records");
  const q = query(recordsRef, where("created_by_uid", "==", viewer.uid));

  const snap = await getDocs(q);
  const visible = [];

  snap.forEach(docSnap => {
    const record = { id: docSnap.id, ...docSnap.data() };
    if (canViewRecord(viewer, record)) {
      visible.push(record);
    }
  });

  return visible;
}
