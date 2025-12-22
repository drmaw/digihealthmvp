/* =====================================================
   DigiHealth – Patient Profile Field Access
   File: /js/profile_field_access.js
===================================================== */

/*
 Rules:
 - Admin: full access
 - Doctor: full view, NO edit
 - Manager / Assistant Manager:
     view & edit → name, age, gender, occupation, address
 - Other staff:
     view only (organization patients)
 - Patient:
     full self view + edit
*/

export function getProfilePermissions(viewer, patientUid) {
  if (!viewer) return null;

  const isSelf = viewer.uid === patientUid;

  /* ADMIN */
  if (viewer.role_id === "admin") {
    return { view: "all", edit: "all" };
  }

  /* DOCTOR */
  if (viewer.role_id === "doctor") {
    return { view: "all", edit: [] };
  }

  /* CLINIC MANAGER / ASSISTANT */
  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager"
  ) {
    return {
      view: [
        "name",
        "age",
        "gender",
        "occupation",
        "address"
      ],
      edit: [
        "name",
        "age",
        "gender",
        "occupation",
        "address"
      ]
    };
  }

  /* STAFF */
  if (viewer.role_id === "staff") {
    return {
      view: [
        "name",
        "age",
        "gender",
        "occupation",
        "address"
      ],
      edit: []
    };
  }

  /* PATIENT (SELF) */
  if (viewer.role_id === "patient" && isSelf) {
    return { view: "all", edit: "all" };
  }

  return null;
}
