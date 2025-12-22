/* =====================================================
   DigiHealth – Central Access Control
   File: /js/access_control.js
   ===================================================== */

/* ---------- PAGE ACCESS ---------- */
export function canEnterPage(user, page) {
  if (!user || user.status !== "active") return false;

  const role = user.role_id;

  const pageRules = {
    admin: ["*"],
    doctor: ["search", "profile", "records", "qr"],
    clinic_manager: ["search", "profile", "staff", "records"],
    assistant_manager: ["search", "profile", "staff"],
    staff: ["search", "profile"],
    patient: ["profile", "records", "qr"],
    representative: ["search"]
  };

  const allowed = pageRules[role] || [];
  return allowed.includes("*") || allowed.includes(page);
}

/* ---------- PROFILE FIELD ACCESS ---------- */
export function canViewField(viewer, field, targetUser) {
  if (!viewer) return false;

  if (viewer.role_id === "admin") return true;

  if (viewer.uid === targetUser.uid) return true;

  if (viewer.role_id === "doctor") return true;

  if (
    ["clinic_manager", "assistant_manager"].includes(viewer.role_id)
  ) {
    return ["name", "age", "gender", "occupation", "address"].includes(field);
  }

  return false;
}

export function canEditField(viewer, field, targetUser) {
  if (!viewer) return false;

  if (viewer.role_id === "admin") return true;

  if (viewer.uid === targetUser.uid) {
    return ["name", "age", "gender", "occupation", "address"].includes(field);
  }

  return false;
}

/* ---------- RECORD ACCESS ---------- */
export function canViewRecord(viewer, record) {
  if (!viewer) return false;

  if (viewer.role_id === "admin") return true;

  if (viewer.uid === record.patient_uid) return true;

  if (viewer.role_id === "doctor") return true;

  if (
    ["clinic_manager", "assistant_manager"].includes(viewer.role_id) &&
    record.visibility === "public"
  ) {
    return true;
  }

  return false;
}

export function canEditRecord(viewer, record) {
  if (!viewer) return false;

  if (viewer.role_id === "admin") return true;

  if (viewer.role_id === "doctor") return true;

  return false;
}

/* ---------- RED FLAG ACCESS ---------- */
export function canSeeRedFlag(viewer) {
  if (!viewer) return false;
  return ["admin", "doctor", "clinic_manager", "assistant_manager", "staff"]
    .includes(viewer.role_id);
}

export function canEditRedFlag(viewer) {
  if (!viewer) return false;
  return ["admin", "doctor"].includes(viewer.role_id);
}

/* ---------- STAFF MANAGEMENT ---------- */
export function canAssignStaff(viewer) {
  if (!viewer) return false;
  return ["admin", "clinic_manager"].includes(viewer.role_id);
}
