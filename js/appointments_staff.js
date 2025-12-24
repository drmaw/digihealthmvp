// js/appointments_staff.js
// --------------------------------------------------
// Doctor / Clinic appointment list with confirm action
// --------------------------------------------------

import { db } from "./firebase.js";
import {
  initAuth,
  isDoctor,
  isClinicRole,
  isAdmin
} from "./auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const listEl = document.getElementById("appointments-list");

(async function start() {
  await initAuth(true);

  if (!(isDoctor() || isClinicRole() || isAdmin())) {
    alert("Access denied.");
    window.location.href = "/index.html";
    return;
  }

  await loadAppointments();
})();

async function loadAppointments() {
  listEl.innerHTML = "Loading…";

  const q = query(
    collection(db, "appointments"),
    where("status", "==", "requested")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No pending appointments.</p>";
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
    btn.textContent = "Confirm";
    btn.onclick = () => confirmAppointment(id);

    div.innerHTML = `
      <div><strong>Date:</strong> ${a.date}</div>
      <div><strong>Time:</strong> ${a.time}</div>
      <div><strong>Status:</strong> ${a.status}</div>
      <div><strong>Patient UID:</strong> ${a.patient_uid}</div>
    `;

    div.appendChild(btn);
    listEl.appendChild(div);
  });
}

async function confirmAppointment(appointmentId) {
  if (!confirm("Confirm this appointment?")) return;

  const ref = doc(db, "appointments", appointmentId);

  await updateDoc(ref, {
    status: "confirmed",
    updated_at: serverTimestamp()
  });

  alert("Appointment confirmed.");
  await loadAppointments();
}
