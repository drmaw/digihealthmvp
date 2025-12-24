// js/appointments_patient.js
// --------------------------------------------------
// Patient appointment request
// --------------------------------------------------

import { db } from "./firebase.js";
import {
  initAuth,
  isPatient,
  currentUser
} from "./auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("appointment-form");
const dateInput = document.getElementById("appt-date");
const timeInput = document.getElementById("appt-time");
const notesInput = document.getElementById("appt-notes");

(async function start() {
  await initAuth(true);

  if (!isPatient()) {
    alert("Only patients can request appointments.");
    window.location.href = "/index.html";
    return;
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!dateInput.value || !timeInput.value) {
    alert("Date and time are required.");
    return;
  }

  await addDoc(collection(db, "appointments"), {
    patient_uid: currentUser.uid,
    doctor_uid: null,
    clinic_id: null,
    requested_by: "patient",
    status: "requested",
    date: dateInput.value,
    time: timeInput.value,
    notes: notesInput.value || null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });

  alert("Appointment request submitted.");
  form.reset();
});
