// js/qr_scan.js
// --------------------------------------------------
// QR scan handler (doctor / clinic / admin side)
// + audit logging
// --------------------------------------------------

import { initAuth, isPatient, currentUserProfile } from "./auth.js";
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.onScanSuccess = async function (decodedText) {
  try {
    await initAuth(true);

    if (isPatient()) {
      alert("Patients cannot scan QR codes.");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch {
      alert("Invalid QR code.");
      return;
    }

    if (!payload || payload.role !== "patient" || !payload.uid) {
      alert("This QR code is not valid.");
      return;
    }

    // -----------------------------
    // AUDIT LOG: QR SCAN
    // -----------------------------
    await addDoc(collection(db, "audit_logs"), {
      actor_uid: currentUserProfile.uid,
      actor_role: currentUserProfile.role_id,
      action: "qr_scan",
      patient_uid: payload.uid,
      timestamp: serverTimestamp()
    });

    sessionStorage.setItem("scanned_patient_uid", payload.uid);

    window.location.href = "/records/view.html";

  } catch (err) {
    console.error("QR scan failed:", err);
    alert("Scan failed.");
  }
};
