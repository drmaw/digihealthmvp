import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const recordsBox = document.getElementById("recordsBox");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/index.html";
    return;
  }
  await loadMyRecords(user.uid);
});

async function loadMyRecords(uid) {
  if (!recordsBox) return;

  recordsBox.innerHTML = "Loading...";

  try {
    const q = query(
      collection(db, "patient_records"),
      where("patient_uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      recordsBox.innerHTML = "<p>No medical records found.</p>";
      return;
    }

    let html = "<ul>";

    snap.forEach(doc => {
      const d = doc.data();
      html += `
        <li>
          <strong>Date:</strong> ${
            d.createdAt?.toDate().toLocaleDateString() || "—"
          }<br>
          <strong>Note:</strong> ${d.note || "—"}
        </li>
        <hr>
      `;
    });

    html += "</ul>";
    recordsBox.innerHTML = html;

  } catch (err) {
    console.error(err);
    recordsBox.innerHTML =
      "<p style='color:red'>Failed to load records</p>";
  }
}
