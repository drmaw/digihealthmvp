import { requireAuth } from "./auth_guard.js";
import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const recordsBox = document.getElementById("recordsBox");

/* =========================
   LOAD PATIENT RECORDS
   ========================= */
async function loadMyRecords() {
  try {
    const user = auth.currentUser;
    if (!user) {
      recordsBox.innerHTML = "<p>Not logged in.</p>";
      return;
    }

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
          <b>Uploaded by:</b> ${d.uploader_role || "Unknown"}<br>
          <b>Date:</b> ${
            d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleString()
              : "N/A"
          }
        </li>
        <hr>
      `;
    });
    html += "</ul>";

    recordsBox.innerHTML = html;
  } catch (err) {
    console.error("Failed to load records:", err);
    recordsBox.innerHTML = "<p>Error loading records.</p>";
  }
}

/* =========================
   AUTH GUARD
   ========================= */
requireAuth("patient", () => {
  loadMyRecords();
});
