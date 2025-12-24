import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const recordsBox = document.getElementById("recordsBox");

async function loadMyRecords(user) {
  if (!recordsBox) return;

  recordsBox.innerHTML = "<p>Loading records...</p>";

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", user.uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      recordsBox.innerHTML = "<p>No medical records found.</p>";
      return;
    }

    let html = "<ul>";

    snap.forEach(doc => {
      const d = doc.data();
      html += `
        <li>
          <b>Date:</b> ${d.createdAt?.toDate?.().toLocaleString() || "N/A"}
          <br>
          <b>Note:</b> ${d.note || "—"}
        </li>
      `;
    });

    html += "</ul>";
    recordsBox.innerHTML = html;

  } catch (err) {
    console.error(err);
    recordsBox.innerHTML = "<p>Error loading records.</p>";
  }
}

onAuthStateChanged(auth, user => {
  if (!user) return;
  loadMyRecords(user);
});
