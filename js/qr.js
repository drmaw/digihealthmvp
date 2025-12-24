// js/qr.js
// --------------------------------------------------
// QR generation logic (patient side)
// Single source of QR payload truth
// --------------------------------------------------

import { initAuth, isPatient, currentUser } from "./auth.js";

// --------------------------------------------------
// DOM
// --------------------------------------------------
const qrContainer = document.getElementById("qr-container");

// --------------------------------------------------
// Bootstrap
// --------------------------------------------------
(async function start() {
  const profile = await initAuth(true);

  // -----------------------------------------------
  // Only patients can generate personal QR
  // -----------------------------------------------
  if (!isPatient()) {
    alert("Access denied.");
    window.location.href = "/index.html";
    return;
  }

  generateQR(profile);
})();

// --------------------------------------------------
// Generate QR
// --------------------------------------------------
function generateQR(profile) {
  const payload = {
    uid: currentUser.uid,
    user_id: profile.user_id || null,
    role: "patient"
  };

  const text = JSON.stringify(payload);

  const img = document.createElement("img");
  img.alt = "Patient QR Code";
  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" +
    encodeURIComponent(text);

  qrContainer.innerHTML = "";
  qrContainer.appendChild(img);
}
