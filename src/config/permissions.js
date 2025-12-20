// src/config/permissions.js

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  CLINIC_MANAGER: "CLINIC_MANAGER",
  MARKETING_REP: "MARKETING_REP",
  PATIENT: "PATIENT"
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],

  ADMIN: [
    "USER_READ",
    "USER_WRITE",
    "ROLE_READ",
    "ROLE_WRITE",
    "AUDIT_READ"
  ],

  DOCTOR: [
    "PATIENT_READ",
    "PATIENT_WRITE",
    "BANNER_ADD",
    "BANNER_REMOVE",
    "COMMENT_WRITE"
  ],

  CLINIC_MANAGER: [
    "PATIENT_READ",
    "PATIENT_WRITE"
  ],

  MARKETING_REP: [
    "DEMO_VIEW"
  ],

  PATIENT: [
    "SELF_READ"
  ]
};

export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}
