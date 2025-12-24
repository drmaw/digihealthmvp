// js/records_view.js
// --------------------------------------------------
// Patient record viewer
// + audit logging
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
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const elName = document.getElementById("patient-name");
const elPhone = document.getElementById("patient-phone");
const elUserId = document.getElementById("patient-user-id");
const elRecords = document.getElementById("records-list");

(async function start() {
  await initAuth(true);

  if (isPatient()) {
    alert("Patients cannot access this page.");
    window.location.href = "/patient.html";
    return;
  }

  const patientUid = sessionStorage.getItem("scanned_patient_uid");

  if (!patientUid) {
    alert("No patient selected.");
    window.location.href = "/qr/scan.html";
    return;
  }

  // -----------------------------
  // AUDIT LOG: RECORD VIEW
  // -----------------------------
  await addDoc(collection(db, "audit_logs"), {
    actor_uid: currentUserProfile.uid,
    actor_role: currentUserProfile.role_id,
    action: "record_view",
    patient_uid: patientUid,
    timestamp: serverTimestamp()
  });

  await loadPatientProfile(patientUid);
  await loadPatientRecords(patientUid);
})();

async function loadPatientProfile(patientUid) {
  const ref = doc(db, "users", patientUid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    elName.textContent = "Not found";
    return;
  }

  const data = snap.data();
  elName.textContent = data.name || "—";
  elPhone.textContent = data.phone || "—";
  elUserId.textContent = data.user_id || patientUid;
}

async function loadPatientRecords(patientUid) {
  elRecords.innerHTML = "Loading…";

  const q = query(
    collection(db, "patient_records"),
    where("patient_uid", "==", patientUid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    elRecords.innerHTML = "No records found.";
    return;
  }

  elRecords.innerHTML = "";

  snap.forEach(docSnap => {
    const d = docSnap.data();
    const div = document.createElement("div");
    div.className = "record";
    div.innerHTML = `
      <div><strong>Date:</strong> ${d.date || "—"}</div>
      <div><strong>Doctor:</strong> ${d.doctor_name || "—"}</div>
      <div><strong>Notes:</strong> ${d.notes || "—"}</div>
    `;
    elRecords.appendChild(div);
  });
}      elRecords.innerHTML =
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
