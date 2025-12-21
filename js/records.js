// js/records.js
import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, query, where,
  updateDoc, deleteDoc, doc, serverTimestamp, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ---------- CREATE (PATIENT UPLOAD) ----------
export async function uploadRecord({ patient_uid, title, notes }) {
  return await addDoc(collection(db, "patient_records"), {
    patient_uid,
    title,
    notes,
    hidden: false,
    created_at: serverTimestamp()
  });
}

// ---------- LIST ----------
export async function listRecordsByPatient(patient_uid, includeHidden = true) {
  let q = query(
    collection(db, "patient_records"),
    where("patient_uid", "==", patient_uid),
    orderBy("created_at", "desc")
  );
  const snap = await getDocs(q);
  let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (!includeHidden) rows = rows.filter(r => !r.hidden);
  return rows;
}

// ---------- VISIBILITY (PATIENT ONLY) ----------
export async function setHidden(recordId, hidden) {
  await updateDoc(doc(db, "patient_records", recordId), {
    hidden
  });
}

// ---------- PERMANENT DELETE (PATIENT ONLY) ----------
export async function deleteRecord(recordId) {
  await deleteDoc(doc(db, "patient_records", recordId));
}
