import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const listEl = document.getElementById("list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  loadDoctorAppointments(user.uid);
});

async function loadDoctorAppointments(uid) {
  listEl.innerHTML = "Loading appointments…";

  const q = query(
    collection(db, "appointments"),
    where("doctor_uid", "==", uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No appointments assigned.</p>";
    return;
  }

  let html = "";

  snap.forEach(doc => {
    const a = doc.data();

    html += `
      <div class="card">
        <b>Date:</b> ${a.appointment_date || "-"}<br>
        <b>Time:</b> ${a.appointment_time || "-"}<br>
        <b>Status:</b> ${a.status || "-"}<br>
        <b>Patient UID:</b> ${a.patient_uid || "-"}
      </div>
    `;
  });

  listEl.innerHTML = html;
}
