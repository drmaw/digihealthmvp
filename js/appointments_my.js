import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const listEl = document.getElementById("my-list");

if (!listEl) {
  console.error("my-list element not found");
}

/* =========================
   WAIT FOR AUTH (ONLY WAY)
   ========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    listEl.innerHTML = "<p>Not logged in.</p>";
    return;
  }

  loadMyAppointments(user.uid);
});

/* =========================
   LOAD APPOINTMENTS
   ========================= */
async function loadMyAppointments(uid) {
  listEl.innerHTML = "Loading appointments…";

  if (!uid) {
    listEl.innerHTML = "User ID missing.";
    return;
  }

  const q = query(
    collection(db, "appointments"),
    where("patient_uid", "==", uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No appointments found.</p>";
    return;
  }

  let html = "";

  snap.forEach(doc => {
    const d = doc.data();

    html += `
      <div class="card">
        <b>Status:</b> ${d.status || "-"}<br>
        <b>Date:</b> ${d.appointment_date || "-"}<br>
        <b>Time:</b> ${d.appointment_time || "-"}
      </div>
    `;
  });

  listEl.innerHTML = html;
}
