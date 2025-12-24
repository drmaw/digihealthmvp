// js/qr_scan.js
// --------------------------------------------------
// QR scan handler (doctor / clinic / admin side)
// Aligns exactly with qr.js payload format
// --------------------------------------------------

import { initAuth, isPatient } from "./auth.js";

// --------------------------------------------------
// Expected global from scan.html:
// function onScanSuccess(decodedText) { ... }
// --------------------------------------------------

window.onScanSuccess = async function (decodedText) {
  try {
    // ---------------------------------------------
    // Ensure user is authenticated
    // ---------------------------------------------
    await initAuth(true);

    // ---------------------------------------------
    // Patients should NOT scan patient QR
    // ---------------------------------------------
    if (isPatient()) {
      alert("Patients cannot scan QR codes.");
      return;
    }

    // ---------------------------------------------
    // Parse QR payload
    // ---------------------------------------------
    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch (e) {
      alert("Invalid QR code format.");
      return;
    }

    // ---------------------------------------------
    // Validate payload structure
    // ---------------------------------------------
    if (
      !payload ||
      payload.role !== "patient" ||
      !payload.uid
    ) {
      alert("This QR code is not a valid patient QR.");
      return;
    }

    // ---------------------------------------------
    // Store scanned patient UID
    // (sessionStorage = temporary, safer)
    // ---------------------------------------------
    sessionStorage.setItem(
      "scanned_patient_uid",
      payload.uid
    );

    if (payload.user_id) {
      sessionStorage.setItem(
        "scanned_patient_user_id",
        payload.user_id
      );
    }

    // ---------------------------------------------
    // Redirect to patient record view / search
    // ---------------------------------------------
    window.location.href = "/records/view.html";

  } catch (err) {
    console.error("QR scan failed:", err);
    alert("Failed to process QR. Please try again.");
  }
};
