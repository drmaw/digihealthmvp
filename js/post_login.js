import { initAuth } from "./auth.js";

(async () => {
  const profile = await initAuth(true);

  if (!profile) return;

  if (profile.approved !== true || profile.status !== "active") {
    alert("Account inactive");
    return;
  }

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
