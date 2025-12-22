/* =========================================================
   DigiHealth — CENTRAL ACCESS CONTROL
   ---------------------------------------------------------
   • ONE source of truth
   • No UI, no Firebase calls
   • Pure decision logic
   • Beginner-readable
   ========================================================= */

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function isActive(user) {
  return user && user.status === "active";
}

function sameUser(a, b) {
  return a && b && a.uid === b.uid;
}

function inSameOrganization(user, target) {
  return (
    user &&
    target &&
    user.organization_id &&
    target.organization_id &&
    user.organization_id === target.organization_id
  );
}

/* =========================================================
   PAGE ACCESS
   ---------------------------------------------------------
   Page names are logical, NOT filenames
   ========================================================= */

export function canEnterPage(user, page) {
  if (!isActive(user)) return false;

  const role = user.role_id;

  const rules = {
    admin: ["*"],

    doctor: [
      "search",
      "profile",
      "records",
      "appointments",
      "qr"
    ],

    clinic_manager: [
      "search",
      "profile",
      "records",
      "appointments",
      "staff",
      "organization"
    ],

    assistant_manager: [
      "search",
      "profile",
      "records",
      "appointments",
      "staff"
    ],

    staff: [
      "search",
      "profile"
    ],

    representative: [
      "search",
      "records"
    ],

    patient: [
      "profile",
      "records",
      "appointments",
      "qr"
    ]
  };

  const allowed = rules[role] || [];
  return allowed.includes("*") || allowed.includes(page);
}

/* =========================================================
   PROFILE ACCESS
   ========================================================= */

export function canViewProfile(viewer, target) {
  if (!isActive(viewer) || !target) return false;

  // Admin sees all
  if (viewer.role_id === "admin") return true;

  // Anyone can see their own profile
  if (sameUser(viewer, target)) return true;

  // Doctor can view any patient
  if (viewer.role_id === "doctor") return true;

  // Organization roles can view patients of same org
  if (
    ["clinic_manager", "assistant_manager", "staff"].includes(viewer.role_id)
  ) {
    return inSameOrganization(viewer, target);
  }

  return false;
}

export function canEditProfile(viewer, target, field) {
  if (!isActive(viewer) || !target) return false;

  // Admin can edit all
  if (viewer.role_id === "admin") return true;

  // User can edit own basic info
  if (sameUser(viewer, target)) {
    return [
      "name",
      "age",
      "gender",
      "occupation",
      "address",
      "photo_url"
    ].includes(field);
  }

  return false;
}

/* =========================================================
   PATIENT RECORD ACCESS
   ========================================================= */

export function canViewRecord(viewer, record, patient) {
  if (!isActive(viewer) || !record) return false;

  // Admin sees all
  if (viewer.role_id === "admin") return true;

  // Patient sees own records
  if (viewer.uid === record.patient_uid) return true;

  // Doctor sees all unless hidden by patient
  if (viewer.role_id === "doctor") {
    return record.visibility !== "private";
  }

  // Organization roles see public records of their org patients
  if (
    ["clinic_manager", "assistant_manager", "staff"].includes(viewer.role_id)
  ) {
    return (
      record.visibility === "public" &&
      patient &&
      inSameOrganization(viewer, patient)
    );
  }

  return false;
}

export function canCreateRecord(viewer) {
  if (!isActive(viewer)) return false;

  return [
    "doctor",
    "clinic_manager",
    "assistant_manager",
    "representative"
  ].includes(viewer.role_id);
}

export function canEditRecord(viewer, record) {
  if (!isActive(viewer) || !record) return false;

  // Admin & doctor only
  return ["admin", "doctor"].includes(viewer.role_id);
}

export function canDeleteRecord(viewer, record) {
  if (!isActive(viewer) || !record) return false;

  // Patient can delete own
  if (viewer.uid === record.patient_uid) return true;

  // Admin only
  return viewer.role_id === "admin";
}

/* =========================================================
   RED FLAG (CRITICAL ALERT)
   ========================================================= */

export function canSeeRedFlag(viewer) {
  if (!isActive(viewer)) return false;

  return [
    "admin",
    "doctor",
    "clinic_manager",
    "assistant_manager",
    "staff"
  ].includes(viewer.role_id);
}

export function canEditRedFlag(viewer) {
  if (!isActive(viewer)) return false;

  return ["admin", "doctor"].includes(viewer.role_id);
}

/* =========================================================
   ORGANIZATION & STAFF
   ========================================================= */

export function canCreateOrganization(viewer) {
  if (!isActive(viewer)) return false;

  // Any individual can apply
  return true;
}

export function canApproveOrganization(viewer) {
  return isActive(viewer) && viewer.role_id === "admin";
}

export function canAssignStaff(viewer) {
  if (!isActive(viewer)) return false;

  return ["admin", "clinic_manager"].includes(viewer.role_id);
}

/* =========================================================
   APPOINTMENTS
   ========================================================= */

export function canCreateAppointment(viewer) {
  if (!isActive(viewer)) return false;

  return [
    "patient",
    "doctor",
    "clinic_manager",
    "assistant_manager"
  ].includes(viewer.role_id);
}

export function canManageAppointment(viewer) {
  if (!isActive(viewer)) return false;

  return [
    "admin",
    "doctor",
    "clinic_manager",
    "assistant_manager"
  ].includes(viewer.role_id);
}

/* =========================================================
   END OF FILE
   ========================================================= */
