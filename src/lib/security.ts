/**
 * look.u AI - Security, Sanitization & Double-Validation Utilities
 * Standar perlindungan data formulir dan validasi server-side
 */

// RFC-5322 compliant regex untuk validasi email
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Regex nomor telepon internasional / Indonesia (8 - 16 digit, diawali +, 08, 62)
const PHONE_REGEX = /^(\+?[0-9]{8,16})$/;

// Format MIME gambar yang diizinkan
const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
]);

/**
 * Validasi ketat format email
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Validasi nomor telepon / WhatsApp opsional
 */
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!cleaned) return true; // Opsional jika kosong
  return PHONE_REGEX.test(cleaned);
}

/**
 * Sanitasi string teks bebas dari tag HTML, karakter kontrol (CRLF injection),
 * dan pemangkasan batas panjang karakter (XSS / Header Injection protection).
 */
export function sanitizePlainText(input: unknown, maxLen = 250): string {
  if (typeof input !== "string") return "";
  
  return input
    // Hapus seluruh blok <script>...</script> dan isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Hapus seluruh blok <style>...</style> dan isinya
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Hapus sisa seluruh tag HTML (<img ...>, <div ...>, dll)
    .replace(/<[^>]*>/g, "")
    // Hapus karakter CRLF untuk mencegah email/HTTP header injection
    .replace(/[\r\n\t]/g, " ")
    // Hapus karakter kontrol ASCII tersembunyi
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Normalisasi spasi ganda
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/**
 * Validasi MIME type berkas gambar
 */
export function isValidImageMime(mime: unknown): boolean {
  if (typeof mime !== "string") return false;
  return ALLOWED_IMAGE_MIMES.has(mime.toLowerCase());
}

/**
 * Deteksi bot honeypot (field tersembunyi harus selalu kosong)
 */
export function isHoneypotTriggered(val: unknown): boolean {
  if (typeof val === "string" && val.trim().length > 0) return true;
  return false;
}
