// app.js

import { ROLES, hasPermission } from "./src/config/permissions.js";

// Firebase references (already initialized in firebase.js)
const auth = firebase.auth();
const db = firebase.firestore();

/* =========================
   AUTH — LOGIN
========================= */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).get();
    })
    .then((doc) => {
      if (!doc.exists) {
        alert("User profile not found");
        auth.signOut();
        return;
      }

      const role = doc.data().role;
      redirectByRole(role);
    })
    .catch((err) => alert(err.message));
}

/* =========================
   ROLE BASED REDIRECT
========================= */
function redirectByRole(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN:
      window.location.href = "admin.html";
      break;

    case ROLES.DOCTOR:
      window.location.href = "doctor.html";
      break;

    case ROLES.CLINIC_MANAGER:
      window.location.href = "dashboard.html";
      break;

    case ROLES.MARKETING_REP:
      window.location.href = "dashboard.html";
      break;

    case ROLES.PATIENT:
      window.location.href = "patient.html";
      break;

    default:
      alert("Invalid role");
      auth.signOut();
  }
}

/* =========================
   PERMISSION GUARD
========================= */
function requirePermission(permission) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) {
      alert("User profile missing");
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
   DEMO MODE LOCK
========================= */
function enableDemoMode() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) return;

    const role = doc.data().role;

    if (role === ROLES.MARKETING_REP) {
      // Disable all inputs
      document
        .querySelectorAll("input, textarea, select, button")
        .forEach((el) => {
          el.disabled = true;
        });

      // Block form submission
      document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Demo mode: action disabled");
        });
      });

      // Demo banner
      const banner = document.createElement("div");
      banner.innerText = "DEMO MODE — NO DATA CAN BE MODIFIED";
      banner.style.position = "fixed";
      banner.style.top = "0";
      banner.style.left = "0";
      banner.style.right = "0";
      banner.style.background = "red";
      banner.style.color = "white";
      banner.style.padding = "10px";
      banner.style.textAlign = "center";
      banner.style.zIndex = "9999";

      document.body.prepend(banner);
    }
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
   EXPORT TO WINDOW
========================= */
window.login = login;
window.logout = logout;
window.requirePermission = requirePermission;
window.enableDemoMode = enableDemoMode;
