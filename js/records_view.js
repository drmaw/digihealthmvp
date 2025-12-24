// js/records_view.js
// --------------------------------------------------
// Patient record viewer (doctor / clinic / admin)
// Read-only access
// --------------------------------------------------

import { db } from "./firebase.js";
import {
  initAuth,
  isPatient,
  currentUserProfile
} from "./auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --------------------------------------------------
// DOM
// --------------------------------------------------
const elName = document.getElementById("patient-name");
const elPhone = document.getElementById("patient-phone");
const elUserId = document.getElementById("patient-user-id");
const elRecords = document.getElementById("records-list");

// --------------------------------------------------
// Bootstrap
// --------------------------------------------------
(async function start() {
  // -----------------------------------------------
  // Auth + role check
  // -----------------------------------------------
  await initAuth(true);

  if (isPatient()) {
    alert("Patients cannot access this page.");
    window.location.href = "/patient.html";
    return;
  }

  // -----------------------------------------------
  // Get scanned patient UID
  // -----------------------------------------------
  const patientUid =
    sessionStorage.getItem("scanned_patient_uid");

  if (!patientUid) {
    alert("No patient selected. Please scan a QR code.");
    window.location.href = "/qr/scan.html";
    return;
  }

  // -----------------------------------------------
  // Load patient profile
  // -----------------------------------------------
  await loadPatientProfile(patientUid);

  // -----------------------------------------------
  // Load patient records
  // -----------------------------------------------
  await loadPatientRecords(patientUid);
})();

// --------------------------------------------------
// Load patient profile
// --------------------------------------------------
async function loadPatientProfile(patientUid) {
  try {
    const ref = doc(db, "users", patientUid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      elName.textContent = "Not found";
      elPhone.textContent = "—";
      elUserId.textContent = "—";
      return;
    }

    const data = snap.data();

    elName.textContent = data.name || "—";
    elPhone.textContent = data.phone || "—";
    elUserId.textContent = data.user_id || patientUid;

  } catch (err) {
    console.error("Failed to load patient profile:", err);
    elName.textContent = "Error";
  }
}

// --------------------------------------------------
// Load patient medical records
// --------------------------------------------------
async function loadPatientRecords(patientUid) {
  elRecords.innerHTML = "Loading records…";

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", patientUid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      elRecords.innerHTML =
        "<p>No medical records found.</p>";
      return;
    }

    elRecords.innerHTML = "";

    snap.forEach(docSnap => {
      const data = docSnap.data();

      const div = document.createElement("div");
      div.className = "record";

      div.innerHTML = `
        <div><strong>Date:</strong> ${data.date || "—"}</div>
        <div><strong>Doctor:</strong> ${data.doctor_name || "—"}</div>
        <div><strong>Notes:</strong> ${data.notes || "—"}</div>
      `;

      elRecords.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load records:", err);
    elRecords.innerHTML =
      "<p>Error loading medical records.</p>";
  }
}
