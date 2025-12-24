import { auth, db } from "/js/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   AUTH STATE
   =============================== */
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  await loadProfile(user.uid);
  await loadRecords(user.uid);
});

/* ===============================
   LOAD PROFILE + QR
   =============================== */
async function loadProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return;

  const u = snap.data();

  document.getElementById("pName").innerText = u.name || "—";
  document.getElementById("pPhone").innerText = u.phone || "—";
  document.getElementById("pHealthId").innerText = u.health_id_10 || "—";

  // SIMPLE QR (health_id only)
  document.getElementById("qrBox").innerHTML = `
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${u.health_id_10}"
      alt="QR Code"
    />
  `;
}

/* ===============================
   LOAD MEDICAL RECORDS
   =============================== */
async function loadRecords(uid) {
  const box = document.getElementById("recordsBox");

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      box.innerHTML = "<p>No medical records found.</p>";
      return;
    }

    let html = "<ul>";
    snap.forEach(d => {
      const r = d.data();
      html += `
        <li>
          <b>Date:</b> ${r.createdAt?.toDate?.() || ""}<br>
          <b>Note:</b> ${r.note || ""}
        </li>
        <hr>
      `;
    });
    html += "</ul>";

    box.innerHTML = html;

  } catch (e) {
    box.innerHTML = "<p>Permission error loading records.</p>";
    console.error(e);
  }
}

/* ===============================
   LOGOUT
   =============================== */
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
