/* =====================================================
   DigiHealth – QR Scan Helper
   File: /js/qr_scan.js
===================================================== */

/*
 QR format (encoded text):
   DigiHealthID:<health_id_10>
*/

let qrScanner = null;

/**
 * Start QR scanning
 * @param {string} containerId - DOM element to mount camera
 * @param {Function} onResult - callback(value)
 */
export function startQRScan(containerId, onResult) {
  stopQRScan();

  const container = document.getElementById(containerId);
  if (!container) {
    console.error("QR container not found");
    return;
  }

  container.innerHTML = `
    <div id="qr-reader" style="width:100%"></div>
    <button id="qr-stop-btn">Stop Scan</button>
  `;

  const script = document.createElement("script");
  script.src = "https://unpkg.com/html5-qrcode";
  script.onload = () => {
    qrScanner = new Html5Qrcode("qr-reader");

    qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        if (decodedText.startsWith("DigiHealthID:")) {
          const value = decodedText.replace("DigiHealthID:", "").trim();
          onResult(value);
          stopQRScan();
        }
      },
      (error) => {
        // silent scan errors
      }
    );
  };

  document.body.appendChild(script);

  document.getElementById("qr-stop-btn").onclick = stopQRScan;
}

/**
 * Stop QR scanning
 */
export function stopQRScan() {
  if (qrScanner) {
    qrScanner.stop().catch(() => {});
    qrScanner.clear().catch(() => {});
    qrScanner = null;
  }

  const reader = document.getElementById("qr-reader");
  if (reader) reader.innerHTML = "";
}
