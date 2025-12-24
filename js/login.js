import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential =
      await signInWithEmailAndPassword(auth, email, password);

    console.log("Login success:", userCredential.user.uid);
    window.location.href = "/loading.html";

  } catch (error) {
    console.error("LOGIN ERROR:", error.code, error.message);
    alert(error.message);
  }
};
