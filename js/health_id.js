// js/health_id.js
// Generates a deterministic 10-digit health ID from Firebase UID

export function generateHealthId10(uid) {
  let hash = 0;

  for (let i = 0; i < uid.length; i++) {
    hash = (hash << 5) - hash + uid.charCodeAt(i);
    hash |= 0; // convert to 32bit int
  }

  // Convert to digits only
  const digits = Math.abs(hash).toString().padStart(10, "0");

  // Ensure exactly 10 digits
  return digits.slice(0, 10);
}
