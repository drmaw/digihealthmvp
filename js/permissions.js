/* =====================================================
   DigiHealth – Permission Matrix
   File: /js/permissions.js
===================================================== */

/*
ROLES
------
admin
doctor
clinic_manager
assistant_manager
staff
patient
representative
*/

/* ---------------------------------
   Patient profile field permissions
---------------------------------- */

export function canViewPatientProfile(viewer, patient) {
  if (!viewer) return false;

  // Admin & Doctor: full access
  if (viewer.role_id === "admin") return true;
  if (viewer.role_id === "doctor") return true;

  // Manager / Assistant: only same organization
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager"
  ) {
    return viewer.organization_id === patient.organization_id;
  }

  // Staff: same organization only
  if (viewer.role_id === "staff") {
    return viewer.organization_id === patient.organization_id;
  }

  // Patient: own profile
  if (viewer.role_id === "patient") {
    return viewer.uid === patient.uid;
  }

  return false;
}

/* ---------------------------------
   Editable patient fields
---------------------------------- */

export function getEditablePatientFields(role) {
  if (role === "admin") {
    return ["*"]; // full control
  }

  if (role === "doctor") {
    return []; // view only
  }

  if (role === "clinic_manager" || role === "assistant_manager") {
    return ["name", "age", "gender", "occupation", "address"];
  }

  return [];
}

/* ---------------------------------
   Red Flag permissions
---------------------------------- */

export function canViewRedFlag(role) {
  return (
    role === "admin" ||
    role === "doctor" ||
    role === "clinic_manager" ||
    role === "assistant_manager" ||
    role === "staff"
  );
}

export function canEditRedFlag(role) {
  return role === "admin" || role === "doctor";
}

export function canViewRedFlagNote(role) {
  return role === "admin" || role === "doctor";
}

/* ---------------------------------
   Medical record visibility
---------------------------------- */

export function canViewRecord(viewer, record) {
  if (!viewer) return false;

  // Admin sees everything
  if (viewer.role_id === "admin") return true;

  // Doctor: all unless patient_only
  if (viewer.role_id === "doctor") {
    return record.visibility !== "patient_only";
  }

  // Organization-based access
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager" ||
    viewer.role_id === "staff"
  ) {
    return (
      viewer.organization_id === record.organization_id &&
      record.visibility !== "patient_only"
    );
  }

  // Patient
  if (viewer.role_id === "patient") {
    return viewer.uid === record.patient_uid;
  }

  return false;
}

/* ---------------------------------
   Record creation permissions
---------------------------------- */

export function canCreateRecord(role) {
  return (
    role === "doctor" ||
    role === "admin" ||
    role === "representative"
  );
}

/* ---------------------------------
   Organization ownership
---------------------------------- */

export function isOrganizationOwner(user) {
  return user?.is_org_owner === true;
}
