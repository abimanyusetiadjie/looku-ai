const fs = require('fs');
const path = 'src/lib/presets.ts';
let code = fs.readFileSync(path, 'utf8');

const returnMatch = code.lastIndexOf('return result;');

if (returnMatch > -1) {
  const dynamicLogic = `
  // --- INJEKSI GOLDEN DATASET (AI ENGINE) ---
  // Mengganti item statis dengan kurasi Golden Dataset yang sesuai dengan parameter User
  
  const mapToOutfitItem = (gItem: any): OutfitItem => ({
    category: gItem.category,
    name: gItem.name,
    material: gItem.material + (gItem.breathabilityScore >= 90 ? " (Sangat Adem)" : ""),
    color: gItem.colorName,
    colorHex: gItem.colorHex,
    estimatedPrice: "Rp " + gItem.marketValidation.estimatedPrice.toLocaleString("id-ID"),
    shopeeQuery: gItem.name,
    tokopediaQuery: gItem.name,
    imageUrl: gItem.imageUrl,
  });

  const getGoldenItem = (cat: string) => {
    let skinToneTarget = "Medium";
    if (pref.skinTone === "fair") skinToneTarget = "Fair";
    if (pref.skinTone === "light") skinToneTarget = "Light";
    if (pref.skinTone === "tan") skinToneTarget = "Tan";
    if (pref.skinTone === "deep") skinToneTarget = "Deep";
    
    let match = GOLDEN_DATASET.find(i => i.category === cat && i.suitableForSkinTones.includes(skinToneTarget as any));
    if (!match) match = GOLDEN_DATASET.find(i => i.category === cat);
    return match;
  };

  const top = getGoldenItem("atasan");
  const bottom = getGoldenItem("bawahan");
  const shoe = getGoldenItem("sepatu");
  const hijab = getGoldenItem("outer_hijab");

  const newItems: OutfitItem[] = [];
  
  if (pref.ownedItem && pref.ownedItem.trim()) {
    newItems.push({
      category: "atasan",
      name: pref.ownedItem.trim(),
      material: "Koleksi Pribadi di Lemari",
      color: "Pilihan Kamu",
      colorHex: result.colorPalette[0]?.hex || "#84A98C",
      estimatedPrice: "Milik Pribadi (Rp 0)",
      shopeeQuery: pref.ownedItem.trim(),
      tokopediaQuery: pref.ownedItem.trim(),
      isOwnedItem: true,
    });
  } else if (top) {
    newItems.push(mapToOutfitItem(top));
  }

  if (bottom) newItems.push(mapToOutfitItem(bottom));
  
  if (pref.isModestHijab && hijab) {
    const hijabItem = mapToOutfitItem(hijab);
    if (pref.hijabMaterial === "pashmina") {
      hijabItem.name = "Pashmina Silk / Crinkle Flowy";
      hijabItem.shopeeQuery = "pashmina crinkle silk";
    }
    newItems.push(hijabItem);
  } else if (!pref.isModestHijab && hijab && pref.vibe === "korean_soft") {
     const outerItem = mapToOutfitItem(hijab);
     outerItem.name = "Lightweight Cardigan (Anti-UV)";
     newItems.push(outerItem);
  }

  if (shoe) newItems.push(mapToOutfitItem(shoe));

  result.items = newItems;
  // --- END INJEKSI ---
  
  return result;
`;
  code = code.substring(0, returnMatch) + dynamicLogic + code.substring(returnMatch + 14);
  fs.writeFileSync(path, code);
  console.log('Patched correctly!');
} else {
  console.log('NOT FOUND');
}
