// /js/auth_guard.js
// DigiHealth — Authentication & Role Guard
// Used by ALL protected pages

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Protect a page by role(s)
 * @param {Array<string>} allowedRoles
 * @param {Function} onAllowed (optional) callback with userProfile
 */
export function requireAuth(allowedRoles = [], onAllowed = null) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = "/index.html";
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        location.href = "/index.html";
        return;
      }

      const profile = snap.data();

      // Normalize status safely
      const status = (profile.status || "").trim().toLowerCase();
      if (status !== "active") {
        location.href = "/index.html";
        return;
      }

      // Doctor approval gate
      if (
        profile.role_id === "doctor" &&
        profile.approved !== true
      ) {
        // Doctor logged in but not approved
        // Allow page to show "pending approval" UI if needed
        if (allowedRoles.includes("doctor")) {
          onAllowed && onAllowed(profile);
          return;
        }
        location.href = "/index.html";
        return;
      }

      // Role gate
      if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role_id)) {
        // Wrong role → redirect to correct dashboard
        redirectByRole(profile.role_id);
        return;
      }

      // Allowed
      onAllowed && onAllowed(profile);

    } catch (e) {
      console.error("auth_guard error:", e);
      location.href = "/index.html";
    }
  });
}

function redirectByRole(role) {
  switch (role) {
    case "admin":
      location.href = "/admin.html";
      break;
    case "doctor":
      location.href = "/doctor.html";
      break;
    case "clinic_manager":
      location.href = "/manager.html";
      break;
    case "assistant_manager":
      location.href = "/assistant_manager.html";
      break;
    case "representative":
      location.href = "/representative.html";
      break;
    case "patient":
    default:
      location.href = "/patient.html";
  }
}
