/* =====================================================
   DigiHealth – Red Flag Access Control
   File: /js/red_flag_access.js
===================================================== */

/*
 Red flag rules:
 - Admin: see + edit flag & note
 - Doctor: see flag + note, edit allowed
 - Manager / Assistant Manager: see flag only
 - Other staff: see flag only
 - Patient: cannot see
*/

export function canSeeRedFlag(viewer) {
  if (!viewer) return false;

  return [
    "admin",
    "doctor",
    "clinic_manager",
    "assistant_manager",
    "staff"
  ].includes(viewer.role_id);
}

export function canSeeRedFlagNote(viewer) {
  if (!viewer) return false;

  return [
    "admin",
    "doctor"
  ].includes(viewer.role_id);
}

export function canEditRedFlag(viewer) {
  if (!viewer) return false;

  return [
    "admin",
    "doctor"
  ].includes(viewer.role_id);
}
