/* =========================================================
   DigiHealth – Profile Field Access Control
   File: /js/profile_field_access.js
   ========================================================= */

/*
 viewer: {
   uid,
   role_id,
   organization_id
 }

 targetUserId: UID of profile being viewed/edited
*/

export function getProfilePermissions(viewer, targetUserId) {
  // Default: no access
  const deny = { view: [], edit: [] };

  if (!viewer || !viewer.role_id) return deny;

  /* =========================
     ADMIN – FULL ACCESS
     ========================= */
  if (viewer.role_id === "admin") {
    return {
      view: "all",
      edit: "all"
    };
  }

  /* =========================
     DOCTOR – VIEW ALL, EDIT NONE
     ========================= */
  if (viewer.role_id === "doctor") {
    return {
      view: "all",
      edit: []
    };
  }

  /* =========================
     CLINIC MANAGER / ASSISTANT
     ========================= */
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager"
  ) {
    return {
      view: ["name", "age", "gender", "occupation", "address"],
      edit: ["name", "age", "gender", "occupation", "address"]
    };
  }

  /* =========================
     PATIENT – OWN PROFILE ONLY
     ========================= */
  if (viewer.role_id === "patient") {
    if (viewer.uid !== targetUserId) return deny;

    return {
      view: ["name", "age", "gender", "occupation", "address"],
      edit: ["name", "age", "gender", "occupation", "address"]
    };
  }

  /* =========================
     OTHER STAFF – VIEW ONLY
     ========================= */
  if (viewer.role_id === "staff") {
    return {
      view: ["name", "age", "gender"],
      edit: []
    };
  }

  return deny;
}
