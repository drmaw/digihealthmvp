import { db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function audit(action, entity, entity_id=null) {
  try {
    await addDoc(collection(db, "activity_logs"), {
      action, entity, entity_id, timestamp: serverTimestamp()
    });
  } catch(e) {}
}
