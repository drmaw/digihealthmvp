import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db, auth } from "./firebase.js";
import { initAuth } from "./auth.js";

const listEl = document.getElementById("my-list");

(async function start() {
  await initAuth(true);
  await loadMyAppointments();
})();

async function loadMyAppointments() {
  if (!listEl) return;

  listEl.innerHTML = "Loading…";

  const user = auth.currentUser;
  if (!user || !user.uid) {
    listEl.innerHTML = "Not logged in.";
    return;
  }

  // 🔴 CHANGE FIELD NAME HERE IF NEEDED
  const q = query(
    collection(db, "appointments"),
    where("patient_uid", "==", user.uid)
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
        <b>Date:</b> ${d.date || "-"}<br>
        <b>Doctor:</b> ${d.doctor_name || "-"}
      </div>
    `;
  });

  listEl.innerHTML = html;
}
