/* =========================================================
   DigiHealth — Patient Records
   File: /js/records.js
   ---------------------------------------------------------
   • View / create / edit / delete records
   • Permission decisions ONLY via access_control.js
   • Firestore is a data store, not a policy engine
   ========================================================= */

import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  canViewRecord,
  canCreateRecord,
  canEditRecord,
  canDeleteRecord
} from "./access_control.js";

/* =========================================================
   LOAD RECORDS FOR A PATIENT
   ========================================================= */

export async function loadPatientRecords(viewer, patientUid, patientData) {
  if (!viewer || !patientUid) return [];

  const recordsRef = collection(db, "patient_records");
  const q = query(recordsRef, where("patient_uid", "==", patientUid));
  const snap = await getDocs(q);

  const visibleRecords = [];

  snap.forEach((docSnap) => {
    const record = { id: docSnap.id, ...docSnap.data() };

    if (canViewRecord(viewer, record, patientData)) {
      visibleRecords.push(record);
    }
  });

  return visibleRecords;
}

/* =========================================================
   CREATE RECORD
   ========================================================= */

export async function createRecord(viewer, data) {
  if (!canCreateRecord(viewer)) {
    throw new Error("Permission denied");
  }

  const record = {
    patient_uid: data.patient_uid,
    organization_id: data.organization_id || null,

    record_type: data.record_type || "general",
    title: data.title || "",
    notes: data.notes || "",

    visibility: data.visibility || "public",

    created_by_uid: viewer.uid,
    created_by_role: viewer.role_id,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, "patient_records"), record);
  return ref.id;
}

/* =========================================================
   UPDATE RECORD
   ========================================================= */

export async function updateRecord(viewer, recordId, updates) {
  const ref = doc(db, "patient_records", recordId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Record not found");
  }

  const record = snap.data();

  if (!canEditRecord(viewer, record)) {
    throw new Error("Permission denied");
  }

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

/* =========================================================
   DELETE RECORD
   ========================================================= */

export async function deleteRecord(viewer, recordId) {
  const ref = doc(db, "patient_records", recordId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Record not found");
  }

  const record = snap.data();

  if (!canDeleteRecord(viewer, record)) {
    throw new Error("Permission denied");
  }

  await deleteDoc(ref);
}

/* =========================================================
   TOGGLE VISIBILITY (PATIENT ONLY)
   ========================================================= */

export async function setRecordVisibility(viewer, recordId, visibility) {
  const ref = doc(db, "patient_records", recordId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Record not found");
  }

  const record = snap.data();

  // Patient can change visibility of own record
  if (viewer.uid !== record.patient_uid) {
    throw new Error("Permission denied");
  }

  await updateDoc(ref, {
    visibility,
    updatedAt: serverTimestamp()
  });
}
