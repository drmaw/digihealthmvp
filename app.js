// app.js

import { ROLES, hasPermission } from "./src/config/permissions.js";

// Firebase
const auth = firebase.auth();
const db = firebase.firestore();

/* =========================
   LOGIN
========================= */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => db.collection("users").doc(cred.user.uid).get())
    .then((doc) => {
      if (!doc.exists) {
        alert("User profile not found");
        auth.signOut();
        return;
      }
      redirectByRole(doc.data().role);
    })
    .catch((err) => alert(err.message));
}

/* =========================
   REDIRECT BY ROLE
========================= */
function redirectByRole(role) {
  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
    window.location.href = "admin.html";
  } else if (role === ROLES.DOCTOR) {
    window.location.href = "doctor.html";
  } else if (role === ROLES.CLINIC_MANAGER || role === ROLES.MARKETING_REP) {
    window.location.href = "dashboard.html";
  } else if (role === ROLES.PATIENT) {
    window.location.href = "patient.html";
  } else {
    alert("Invalid role");
    auth.signOut();
  }
}

/* =========================
   PAGE PERMISSION GUARD
========================= */
function requirePermission(permission) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) {
      auth.signOut();
      return;
    }

    const role = doc.data().role;
    if (!hasPermission(role, permission)) {
      alert("Access denied");
      window.location.href = "dashboard.html";
    }
  });
}

/* =========================
   DOCTOR-ONLY UI ENFORCER
========================= */
function enforceDoctorOnlyUI() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) return;

    const role = doc.data().role;
    const banner = document.getElementById("redBannerControl");

    if (banner && role !== ROLES.DOCTOR) {
      banner.style.display = "none";
    }
  });
}

/* =========================
   RED BANNER LOAD & SAVE
========================= */
function initRedBanner(patientRecordId) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) return;

    const role = userDoc.data().role;

    const toggle = document.getElementById("redBannerToggle");
    const comment = document.getElementById("redBannerComment");
    const saveBtn = document.getElementById("saveRedBannerBtn");

    if (!toggle || !comment || !saveBtn) return;

    const ref = db.collection("patient_records").doc(patientRecordId);

    // LOAD
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      toggle.checked = data.red_banner === true;
      comment.value = data.red_banner_comment || "";
    }

    // SAVE (doctor only)
    saveBtn.onclick = async () => {
      if (role !== ROLES.DOCTOR) {
        alert("Only doctors can modify this");
        return;
      }

      await ref.update({
        red_banner: toggle.checked,
        red_banner_comment: comment.value || ""
      });

      alert("Red banner updated");
    };
  });
}

/* =========================
   LOGOUT
========================= */
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

/* =========================
   EXPORTS
========================= */
window.login = login;
window.logout = logout;
window.requirePermission = requirePermission;
window.enforceDoctorOnlyUI = enforceDoctorOnlyUI;
window.initRedBanner = initRedBanner;
