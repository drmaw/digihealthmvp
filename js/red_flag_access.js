/* ==========================================================
   DigiHealth — Red Flag Access Control
   File: /js/red_flag_access.js
   ========================================================== */

/*
Returns:
{
  view: boolean,   // can see red flag banner
  edit: boolean    // can add/remove/edit red flag & note
}
*/

export function getRedFlagPermissions(viewer) {
  if (!viewer || !viewer.role_id) {
    return { view: false, edit: false };
  }

  // ADMIN — full control
  if (viewer.role_id === "admin") {
    return { view: true, edit: true };
  }

  // DOCTOR — full control
  if (viewer.role_id === "doctor") {
    return { view: true, edit: true };
  }

  // CLINIC MANAGER / ASSISTANT — view only
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager"
  ) {
    return { view: true, edit: false };
  }

  // PATIENT — can see own red flag only (no edit)
  if (viewer.role_id === "patient") {
    return { view: true, edit: false };
  }

  // STAFF / REPRESENTATIVE / OTHERS — no access
  return { view: false, edit: false };
}
