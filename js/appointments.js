import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* Create appointment */
export async function createAppointment(data) {
  return await addDoc(collection(db, "appointments"), {
    patient_uid: data.patient_uid,
    doctor_uid: data.doctor_uid || null,
    organization_id: data.organization_id || null,
    scheduled_at: data.scheduled_at,
    status: "requested",
    created_by_uid: data.created_by_uid,
    created_by_role: data.created_by_role,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
}

/* List appointments */
export async function listAppointments(filters = {}) {
  let q = collection(db, "appointments");

  if (filters.patient_uid) {
    q = query(q, where("patient_uid", "==", filters.patient_uid));
  }

  if (filters.doctor_uid) {
    q = query(q, where("doctor_uid", "==", filters.doctor_uid));
  }

  if (filters.organization_id) {
    q = query(q, where("organization_id", "==", filters.organization_id));
  }

  q = query(q, orderBy("scheduled_at", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* Update appointment status */
export async function updateAppointmentStatus(id, status) {
  await updateDoc(doc(db, "appointments", id), {
    status,
    updated_at: serverTimestamp()
  });
}
