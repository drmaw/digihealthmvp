import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function requireRole(role) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return location.href = "/index.html";
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists() || snap.data().role_id !== role) {
      return location.href = "/index.html";
    }
  });
}
