import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/*
  Global search by:
  - DigiHealth ID
  - Mobile number
*/
export async function searchUser(input) {
  input = input.trim();

  if (!input) return null;

  let q;

  // DigiHealth ID (10 digits)
  if (/^\d{10}$/.test(input)) {
    q = query(
      collection(db, "users"),
      where("digihealth_id", "==", input),
      limit(1)
    );
  }
  // Mobile number (Bangladesh)
  else if (/^01\d{9}$/.test(input)) {
    q = query(
      collection(db, "users"),
      where("mobile", "==", input),
      limit(1)
    );
  } else {
    return null;
  }

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const doc = snap.docs[0];
  return {
    uid: doc.id,
    ...doc.data()
  };
}
