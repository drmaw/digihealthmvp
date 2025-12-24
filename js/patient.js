import { requireAuth } from "./auth_guard.js";
import { db } from "./firebase.js";

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
async function loadMyRecords(user) {
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
          <strong>Uploaded by:</strong> ${d.uploader_role || "Unknown"}<br>
          <strong>Date:</strong> ${
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
requireAuth("patient", (profile) => {
  loadMyRecords(profile);
});
