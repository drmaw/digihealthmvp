// js/patient.js
// --------------------------------------------------
// Patient dashboard logic
// Uses auth.js as the single auth/role source
// --------------------------------------------------

import { db } from "./firebase.js";
import {
  initAuth,
  isPatient,
  logout,
  currentUser,
  currentUserProfile
} from "./auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --------------------------------------------------
// DOM helpers
// --------------------------------------------------
const elName = document.getElementById("profile-name");
const elPhone = document.getElementById("profile-phone");
const elUserId = document.getElementById("profile-user-id");
const elQrContainer = document.getElementById("qr-container");
const elRecords = document.getElementById("records-list");
const logoutBtn = document.getElementById("logoutBtn");

// --------------------------------------------------
// Page bootstrap
// --------------------------------------------------
(async function start() {
  const profile = await initAuth(true);

  // -----------------------------------------------
  // Role enforcement
  // -----------------------------------------------
  if (!isPatient()) {
    alert("Access denied. Patient account required.");
    window.location.href = "/index.html";
    return;
  }

  // -----------------------------------------------
  // Render profile
  // -----------------------------------------------
  renderProfile(profile);

  // -----------------------------------------------
  // Generate QR
  // -----------------------------------------------
  generateQR(profile);

  // -----------------------------------------------
  // Load records
  // -----------------------------------------------
  await loadRecords();

  // -----------------------------------------------
  // Logout
  // -----------------------------------------------
  logoutBtn.addEventListener("click", logout);
})();

// --------------------------------------------------
// Render patient profile
// --------------------------------------------------
function renderProfile(profile) {
  elName.textContent = profile.name || "—";
  elPhone.textContent = profile.phone || "—";
  elUserId.textContent = profile.user_id || currentUser.uid;
}

// --------------------------------------------------
// Generate QR code
// --------------------------------------------------
function generateQR(profile) {
  // What we encode in QR (simple & explicit)
  const qrPayload = {
    uid: currentUser.uid,
    user_id: profile.user_id || null,
    role: "patient"
  };

  const qrText = JSON.stringify(qrPayload);

  // Use a public QR generator (simple for now)
  const img = document.createElement("img");
  img.alt = "Patient QR Code";
  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(qrText);

  elQrContainer.innerHTML = "";
  elQrContainer.appendChild(img);
}

// --------------------------------------------------
// Load patient medical records
// --------------------------------------------------
async function loadRecords() {
  elRecords.innerHTML = "Loading records...";

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", currentUser.uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      elRecords.innerHTML = "<p>No records found.</p>";
      return;
    }

    elRecords.innerHTML = "";

    snap.forEach(docSnap => {
      const data = docSnap.data();

      const div = document.createElement("div");
      div.style.borderBottom = "1px solid #ddd";
      div.style.padding = "8px 0";

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
      "<p>Error loading records. Please try again later.</p>";
  }
}
