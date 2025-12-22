/* =====================================================
   DigiHealth – Representative Access Control
   File: /js/representative_access.js
===================================================== */

/*
 Representative rules:
 - Can search patient by ID / phone / QR
 - Can upload medical documents (images / PDF)
 - Cannot view records after upload
 - Cannot edit or delete any data
*/

export function isRepresentative(user) {
  return user?.role_id === "representative";
}

export function canSearchPatient(user) {
  return isRepresentative(user);
}

export function canUploadDocument(user) {
  return isRepresentative(user);
}

export function canViewRecords(user) {
  // Representatives cannot browse records
  return false;
}

export function canEditOrDelete(user) {
  return false;
}
