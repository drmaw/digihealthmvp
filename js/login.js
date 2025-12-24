import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById("loginForm");
const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const msgEl = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgEl.innerText = "Logging in…";

  try {
    await signInWithEmailAndPassword(
      auth,
      emailEl.value,
      passEl.value
    );

    // 🔑 DO NOT CHECK ANYTHING HERE
    window.location.href = "/loading.html";

  } catch (err) {
    console.error(err);
    msgEl.innerText = "Invalid email or password";
  }
});
