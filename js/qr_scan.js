/* =========================================================
   DigiHealth — QR Scan Handler
   File: /js/qr_scan.js
   ---------------------------------------------------------
   • QR does NOT access Firestore directly
   • QR only extracts identifier
   • Actual permission checks happen later
   ========================================================= */

/*
Expected QR payload formats:
1) DigiHealth ID (10 digits)
2) Mobile number (01XXXXXXXXX)
3) JSON: { "health_id_10": "1234567890" }
*/

export function extractSearchKeyFromQR(raw) {
  if (!raw) return null;

  raw = raw.trim();

  // Case 1: plain DigiHealth ID
  if (/^\d{10}$/.test(raw)) {
    return raw;
  }

  // Case 2: mobile number
  if (/^01\d{9}$/.test(raw)) {
    return raw;
  }

  // Case 3: JSON payload
  try {
    const obj = JSON.parse(raw);
    if (obj.health_id_10 && /^\d{10}$/.test(obj.health_id_10)) {
      return obj.health_id_10;
    }
    if (obj.mobile && /^01\d{9}$/.test(obj.mobile)) {
      return obj.mobile;
    }
  } catch (_) {
    // ignore
  }

  return null;
}

/* =========================================================
   QR PAGE REDIRECT HELPER
   ---------------------------------------------------------
   Used by qr/scan.html
   ========================================================= */

export function handleQRResult(raw) {
  const key = extractSearchKeyFromQR(raw);
  if (!key) {
    alert("Invalid QR code");
    return;
  }

  // Redirect to unified search entry
  window.location.href =
    "/clinic/search.html?key=" + encodeURIComponent(key);
}
