/* =========================
   DEMO MODE LOCK
========================= */
function enableDemoMode() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) return;

    const role = doc.data().role;

    if (role === "MARKETING_REP") {
      // Disable all inputs
      document.querySelectorAll("input, textarea, select, button").forEach(el => {
        el.disabled = true;
      });

      // Prevent all form submissions
      document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", e => {
          e.preventDefault();
          alert("Demo mode: action disabled");
        });
      });

      // Visual banner
      const banner = document.createElement("div");
      banner.innerText = "DEMO MODE — NO DATA CAN BE MODIFIED";
      banner.style.position = "fixed";
      banner.style.top = "0";
      banner.style.left = "0";
      banner.style.right = "0";
      banner.style.background = "red";
      banner.style.color = "white";
      banner.style.padding = "10px";
      banner.style.textAlign = "center";
      banner.style.zIndex = "9999";

      document.body.prepend(banner);
    }
  });
}

window.enableDemoMode = enableDemoMode;
