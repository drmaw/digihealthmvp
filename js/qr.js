/*
  QR payload policy:
  - Minimal
  - Non-sensitive
  - Uses DigiHealth ID as primary key
*/

export function generateProfileQR(imgEl, payload) {
  const encoded = btoa(JSON.stringify(payload));
  imgEl.src =
    "https://api.qrserver.com/v1/create-qr-code/?" +
    "size=180x180&data=" + encodeURIComponent(encoded);
}

export function parseQRPayload(raw) {
  try {
    return JSON.parse(atob(raw));
  } catch (e) {
    return null;
  }
}
