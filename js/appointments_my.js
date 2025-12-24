import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const listEl = document.getElementById("my-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  // ✅ THIS WAS THE BUG
  loadMyAppointments(user.uid);
});

async function loadMyAppointments(uid) {
  listEl.innerHTML = "Loading…";

  const q = query(
    collection(db, "appointments"),
    where("patient_uid", "==", uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No appointments found.</p>";
    return;
  }

  listEl.innerHTML = "";

  snap.forEach(docSnap => {
    const a = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #ccc";
    div.style.padding = "10px";

    div.innerHTML = `
      <p><b>Date:</b> ${a.date || "-"}</p>
      <p><b>Time:</b> ${a.time || "-"}</p>
      <p><b>Status:</b> ${a.status || "-"}</p>
    `;

    if (a.status === "requested") {
      const btn = document.createElement("button");
      btn.textContent = "Cancel";
      btn.onclick = () => cancelAppointment(id);
      div.appendChild(btn);
    }

    listEl.appendChild(div);
  });
}

async function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) return;

  await updateDoc(doc(db, "appointments", id), {
    status: "cancelled",
    updated_at: serverTimestamp()
  });

  location.reload();
}
