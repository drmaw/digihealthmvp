// js/appointments_my.js
// --------------------------------------------------
// Patient appointment list + cancel + audit
// --------------------------------------------------

import { db } from "./firebase.js";
import {
  initAuth,
  isPatient,
  currentUserProfile
} from "./auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const listEl = document.getElementById("my-list");

(async function start() {
  await initAuth(true);

  if (!isPatient()) {
    alert("Access denied.");
    window.location.href = "/index.html";
    return;
  }

  await loadMyAppointments();
})();

async function loadMyAppointments() {
  listEl.innerHTML = "Loading…";

  const q = query(
    collection(db, "appointments"),
    where("patient_uid", "==", currentUserProfile.uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No appointments.</p>";
    return;
  }

  listEl.innerHTML = "";

  snap.forEach(docSnap => {
    const a = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #ccc";
    div.style.padding = "8px 0";

    const btn = document.createElement("button");
    btn.textContent = "Cancel";
    btn.disabled = a.status !== "requested";
    btn.onclick = () => cancelAppointment(id);

    div.innerHTML = `
      <div><strong>Date:</strong> ${a.date}</div>
      <div><strong>Time:</strong> ${a.time}</div>
      <div><strong>Status:</strong> ${a.status}</div>
    `;

    div.appendChild(btn);
    listEl.appendChild(div);
  });
}

async function cancelAppointment(appointmentId) {
  if (!confirm("Cancel this appointment?")) return;

  const ref = doc(db, "appointments", appointmentId);

  await updateDoc(ref, {
    status: "cancelled",
    updated_at: serverTimestamp()
  });

  // AUDIT LOG — appointment cancelled
  await addDoc(collection(db, "audit_logs"), {
    actor_uid: currentUserProfile.uid,
    actor_role: currentUserProfile.role_id,
    action: "appointment_cancelled",
    appointment_id: appointmentId,
    patient_uid: currentUserProfile.uid,
    timestamp: serverTimestamp()
  });

  alert("Appointment cancelled.");
  await loadMyAppointments();
}
