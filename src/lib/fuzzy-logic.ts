/**
 * Sistem Inferensi Fuzzy Mamdani (Fuzzy Inference System)
 * Diimplementasikan untuk Capstone Project / Tugas Akhir
 * Fungsi: Memetakan ketidakpastian Suhu (Iklim) dan Warna Kulit menjadi Skor Kecocokan Pakaian (0-100).
 */

// 1. FUZZY SETS DEFINITIONS (Fuzzifikasi)

/** Menghitung derajat keanggotaan suhu (Derajat: 0.0 - 1.0) */
export function fuzzifyTemperature(tempCelcius: number) {
  // Himpunan: Sejuk (< 26°C), Hangat (24-31°C), Panas (> 29°C)
  let sejuk = 0, hangat = 0, panas = 0;

  // Kurva Sejuk (Trapesium Kiri)
  if (tempCelcius <= 24) sejuk = 1;
  else if (tempCelcius > 24 && tempCelcius < 27) sejuk = (27 - tempCelcius) / (27 - 24);

  // Kurva Hangat (Segitiga)
  if (tempCelcius > 24 && tempCelcius <= 27) hangat = (tempCelcius - 24) / (27 - 24);
  else if (tempCelcius > 27 && tempCelcius < 31) hangat = (31 - tempCelcius) / (31 - 27);

  // Kurva Panas (Trapesium Kanan)
  if (tempCelcius >= 31) panas = 1;
  else if (tempCelcius > 29 && tempCelcius < 31) panas = (tempCelcius - 29) / (31 - 29);

  return { sejuk, hangat, panas };
}

/** 
 * Menghitung derajat keanggotaan warna kulit ke Undertone
 * Karena input berupa kategori ('fair', 'medium', 'deep'), kita ubah menjadi crisp input ordinal (0-10)
 * Fair = 2, Light = 4, Medium = 6, Tan = 8, Deep = 10
 */
export function fuzzifySkinTone(skinToneId: string) {
  let val = 6; // default medium
  if (skinToneId === 'fair') val = 2;
  if (skinToneId === 'light') val = 4;
  if (skinToneId === 'medium') val = 6;
  if (skinToneId === 'tan') val = 8;
  if (skinToneId === 'deep') val = 10;

  let cool = 0, neutral = 0, warm = 0;

  if (val <= 3) cool = 1;
  else if (val > 3 && val < 5) cool = (5 - val) / 2;

  if (val > 3 && val <= 5) neutral = (val - 3) / 2;
  else if (val > 5 && val < 7) neutral = (7 - val) / 2;

  if (val >= 7) warm = 1;
  else if (val > 5 && val < 7) warm = (val - 5) / 2;

  return { cool, neutral, warm };
}

// 2. FUZZY RULES EVALUATION (Basis Aturan)

export interface GarmentAttributes {
  breathabilityIndex: number; // 0.0 - 1.0 (Contoh: Linen = 0.9, Furing/Polyester = 0.2)
  colorWarmthIndex: number;   // 0.0 - 1.0 (Contoh: Blue = 0.1, Sage = 0.5, Orange = 0.9)
}

/** 
 * Rule Base Engine: 
 * Mengevaluasi 9 Aturan Fuzzy untuk menghasilkan derajat kesesuaian output (Rendah, Sedang, Tinggi)
 */
export function evaluateFuzzyRules(
  temp: { sejuk: number; hangat: number; panas: number },
  skin: { cool: number; neutral: number; warm: number },
  garment: GarmentAttributes
) {
  // Atribut Pakaian (Crisp to Fuzzy)
  const isBreathable = garment.breathabilityIndex >= 0.7 ? 1 : 0;
  const isWarmColor = garment.colorWarmthIndex >= 0.6 ? 1 : 0;
  const isCoolColor = garment.colorWarmthIndex <= 0.4 ? 1 : 0;

  // Derajat Konsekuen Output (0.0 - 1.0)
  let kecocokanTinggi = 0;
  let kecocokanSedang = 0;
  let kecocokanRendah = 0;

  // R1: JIKA Suhu Panas DAN Baju Breathable MAKA Kecocokan Suhu = Tinggi
  const r1 = Math.min(temp.panas, isBreathable);
  // R2: JIKA Suhu Panas DAN Baju TIDAK Breathable MAKA Kecocokan Suhu = Rendah (Furing di 33°C = Fatal)
  const r2 = Math.min(temp.panas, 1 - isBreathable);
  // R3: JIKA Kulit Warm DAN Baju WarmColor MAKA Kecocokan Warna = Tinggi
  const r3 = Math.min(skin.warm, isWarmColor);
  // R4: JIKA Kulit Cool DAN Baju CoolColor MAKA Kecocokan Warna = Tinggi
  const r4 = Math.min(skin.cool, isCoolColor);
  // R5: JIKA Kulit Neutral MAKA Kecocokan Warna = Sedang (Aman untuk semua)
  const r5 = skin.neutral;

  // Agregasi (Max)
  kecocokanTinggi = Math.max(r1, r3, r4);
  kecocokanRendah = r2;
  kecocokanSedang = r5;

  return { kecocokanRendah, kecocokanSedang, kecocokanTinggi };
}

// 3. DEFUZZIFICATION (Centroid Method)

/**
 * Mengubah himpunan Fuzzy hasil evaluasi menjadi angka Crisp Score (0 - 100)
 */
export function defuzzify(fuzzyOutput: { kecocokanRendah: number; kecocokanSedang: number; kecocokanTinggi: number }) {
  // Output Himpunan Fuzzy (Rendah berpusat di 25, Sedang di 50, Tinggi di 85)
  const pusatRendah = 25;
  const pusatSedang = 50;
  const pusatTinggi = 85;

  const pembilang = 
    (fuzzyOutput.kecocokanRendah * pusatRendah) +
    (fuzzyOutput.kecocokanSedang * pusatSedang) +
    (fuzzyOutput.kecocokanTinggi * pusatTinggi);
    
  const penyebut = 
    fuzzyOutput.kecocokanRendah + fuzzyOutput.kecocokanSedang + fuzzyOutput.kecocokanTinggi;

  if (penyebut === 0) return 50; // Fallback jika tidak ada rules yang aktif
  
  return pembilang / penyebut; // Final Score 0 - 100
}

/**
 * Main Interface untuk dipanggil di aplikasi
 */
export function calculateOutfitFuzzyScore(temperature: number, skinTone: string, garment: GarmentAttributes): number {
  const tempFuzzy = fuzzifyTemperature(temperature);
  const skinFuzzy = fuzzifySkinTone(skinTone);
  const evaluatedRules = evaluateFuzzyRules(tempFuzzy, skinFuzzy, garment);
  const finalScore = defuzzify(evaluatedRules);
  
  return finalScore;
}
