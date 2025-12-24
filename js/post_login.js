import { initAuth } from "./auth.js";

(async () => {
  const profile = await initAuth(true);
  if (!profile) return;

  // NO inactive check here — auth.js already handled it

  if (profile.role_id === "patient") {
    window.location.href = "/patient.html";
  } else if (profile.role_id === "doctor") {
    window.location.href = "/doctor/appointments.html";
  } else if (profile.role_id === "admin") {
    window.location.href = "/admin.html";
  } else {
    alert("Unknown role");
  }
})();
