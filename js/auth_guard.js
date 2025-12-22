import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export async function requireAuth(allowedRoles = []) {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "/index.html";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        alert("User record missing");
        window.location.href = "/index.html";
        return;
      }

      const data = { uid: user.uid, ...snap.data() };

      if (allowedRoles.length && !allowedRoles.includes(data.role_id)) {
        alert("Access denied");
        window.location.href = "/dashboard.html";
        return;
      }

      resolve(data);
    });
  });
}
