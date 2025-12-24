import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const msgEl = document.getElementById("msg");
const btn = document.getElementById("submitBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "/index.html";
    return;
  }
  currentUser = user;
});

btn.onclick = async () => {
  if (!currentUser) return;

  if (!dateEl.value || !timeEl.value) {
    msgEl.innerText = "Please select date and time.";
    return;
  }

  btn.disabled = true;
  msgEl.innerText = "Submitting…";

  try {
    await addDoc(collection(db, "appointments"), {
      patient_uid: currentUser.uid,
      status: "requested",
      appointment_date: dateEl.value,
      appointment_time: timeEl.value,
      created_at: serverTimestamp()
    });

    msgEl.innerText = "Appointment requested.";
    setTimeout(() => {
      location.href = "/appointments/my.html";
    }, 1000);

  } catch (e) {
    console.error(e);
    msgEl.innerText = "Failed to request appointment.";
    btn.disabled = false;
  }
};
