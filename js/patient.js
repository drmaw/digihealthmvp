import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   AUTH ENTRY POINT
   ========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  await loadProfile(user.uid);
  await renderQR(user.uid);
  await loadMyRecords(user.uid);
});

/* =========================
   PROFILE
   ========================= */
async function loadProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return;

  const d = snap.data();

  document.getElementById("pName").innerText = d.name || "—";
  document.getElementById("pPhone").innerText = d.phone || "—";
  document.getElementById("pHealthId").innerText = d.health_id_10 || "—";
}

/* =========================
   QR CODE (health_id_10 ONLY)
   ========================= */
async function renderQR(uid) {
  const qrBox = document.getElementById("qrBox");
  qrBox.innerHTML = "";

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) {
    qrBox.innerText = "Profile not found";
    return;
  }

  const healthId = snap.data().health_id_10;
  if (!healthId) {
    qrBox.innerText = "Health ID missing";
    return;
  }

  new QRCode(qrBox, {
    text: healthId,
    width: 160,
    height: 160
  });
}

/* =========================
   MEDICAL RECORDS
   ========================= */
async function loadMyRecords(uid) {
  const box = document.getElementById("recordsBox");
  box.innerHTML = "";

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      box.innerHTML = "<p>No medical records found</p>";
      return;
    }

    snap.forEach(docu => {
      const r = docu.data();
      box.innerHTML += `
        <div style="border:1px solid #ccc;padding:6px;margin-bottom:6px">
          <div><b>Date:</b> ${r.createdAt?.toDate?.() || ""}</div>
          <div><b>Note:</b> ${r.note || ""}</div>
        </div>
      `;
    });

  } catch (e) {
    box.innerHTML = "<p>Failed to load records</p>";
    console.error(e);
  }
}

/* =========================
   LOGOUT
   ========================= */
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
