const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// --- 1. STUDIO PAGE ---
const studioPage = path.join(process.cwd(), 'src/app/studio/page.tsx');
replaceFile(studioPage, [
    [/👗/g, ""],
    [/☀️/g, ""],
    [/🌡️/g, ""],
    [/👔/g, ""],
    [/✨/g, ""],
    [/📅/g, ""],
    [/🗓️/g, ""],
    [/Jadwal OOTD 7 Hari \(Weekly Planner\)/g, "WEEKLY PLANNER"],
    [/rounded-2xl/g, "rounded-sm"],
    [/rounded-xl/g, "rounded-sm"],
    [/Kustomisasi Detail Acara, Cuaca & Budget ➔/g, "ADJUST PREFERENCES ➔"],
    [/AI STYLIST ATELIER/g, "AI STYLIST ATELIER"],
    [/Studio Padu Padan/g, "The Studio"],
]);

// --- 2. GENERATOR FORM ---
const formFile = path.join(process.cwd(), 'src/components/GeneratorForm.tsx');
replaceFile(formFile, [
    [/👗/g, ""],
    [/💼/g, ""],
    [/☕/g, ""],
    [/🌴/g, ""],
    [/💍/g, ""],
    [/🏃‍♀️/g, ""],
    [/💸/g, ""],
    [/💰/g, ""],
    [/👑/g, ""],
    [/☀️/g, ""],
    [/🌧️/g, ""],
    [/❄️/g, ""],
    [/🌬️/g, ""],
    [/👩‍🦰/g, ""],
    [/👨‍🦱/g, ""],
    [/🧕/g, ""],
    [/📷/g, ""],
    [/📸/g, ""],
    [/✨/g, ""],
    [/Tahap 1/g, "STEP 01"],
    [/Tahap 2/g, "STEP 02"],
    [/Tahap 3/g, "STEP 03"],
    [/Profil Pribadi & Cuaca/g, "Personal Context"],
    [/Kesempatan & Budget/g, "Occasion & Budget"],
    [/rounded-2xl/g, "rounded-sm"],
    [/rounded-xl/g, "rounded-sm"],
    [/rounded-3xl/g, "rounded-none"],
    [/MIX & MATCH OUTFIT SAYA/g, "GENERATE LOOK"],
    [/MIX & MATCH OUTFIT KAMU\.\.\./g, "GENERATING LOOK..."],
    [/Foto Baju Lemarimu/g, "Scan Garment"],
    [/Padukan dengan Pakaian Milikmu Sendiri/g, "Incorporate Owned Garment"],
]);

// --- 3. OUTFIT CARD ---
const outfitCard = path.join(process.cwd(), 'src/components/OutfitCard.tsx');
replaceFile(outfitCard, [
    [/📌/g, ""],
    [/📸/g, ""],
    [/💬/g, ""],
    [/↻/g, ""],
    [/✨/g, ""],
    [/🌟/g, ""],
    [/✅/g, ""],
    [/Simpan ke Lemari/g, "SAVE TO WARDROBE"],
    [/Export Story/g, "EXPORT EDITORIAL"],
    [/Ganti Atasan/g, "CHANGE PIECE"],
    [/Ganti Bawahan/g, "CHANGE PIECE"],
    [/Ganti Hijab\/Outer/g, "CHANGE PIECE"],
    [/Ganti Sepatu/g, "CHANGE PIECE"],
    [/Nilai Kecocokan/g, "Style Algorithm Match"],
    [/rounded-2xl/g, "rounded-none"],
    [/rounded-xl/g, "rounded-none"],
    [/rounded-3xl/g, "rounded-sm"],
    [/bg-emerald-50 text-emerald-800 border-emerald-200/g, "bg-charcoal-900 text-white border-charcoal-900"],
    [/bg-charcoal-900 text-white/g, "bg-charcoal-900 text-white"], // standardize buttons
    [/KENAPA KOMBINASI INI COCOK BUAT KAMU/g, "STYLING RATIONALE"],
    [/Tips Stylist/g, "Stylist Note"],
    [/PANDUAN PERAWATAN KAIN \(AGAR TIDAK SUSUT & ADEM\)/g, "FABRIC CARE & LONGEVITY"],
    [/Kurang pas\? Arahkan gaya OOTD kamu/g, "Directional Adjustments"],
    [/Variasi Lain/g, "Regenerate"],
]);

console.log("High-end aesthetics patched into Studio Menu!");
