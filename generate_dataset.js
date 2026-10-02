const fs = require('fs');

const BRANDS = {
  functional: ['Uniqlo', 'Muji', 'Marks & Spencer'],
  modest: ['Vanilla Hijab', 'Klamby', 'Kami Idea', 'Cottonink', 'Buttonscarves'],
  premium: ['Zara', 'Mango', 'H&M', 'Massimo Dutti'],
  casual: ['Erigo', 'Roughneck', '3Second']
};

const COLORS = [
  { hex: '#FFFFFF', name: 'Putih / Broken White', tone: ['fair', 'light', 'medium', 'tan', 'deep'] },
  { hex: '#1C1C1C', name: 'Hitam / Onyx', tone: ['fair', 'light', 'medium', 'tan', 'deep'] },
  { hex: '#F5F5DC', name: 'Beige / Oat', tone: ['medium', 'tan', 'deep'] },
  { hex: '#84A98C', name: 'Sage Green', tone: ['fair', 'light', 'medium'] },
  { hex: '#C69C6D', name: 'Mocca / Camel', tone: ['light', 'medium', 'tan'] },
  { hex: '#5D6D7E', name: 'Steel Blue', tone: ['fair', 'light', 'deep'] },
  { hex: '#800000', name: 'Maroon', tone: ['fair', 'tan', 'deep'] },
  { hex: '#FFB6C1', name: 'Soft Pink', tone: ['fair', 'light', 'medium'] }
];

const MATERIALS = [
  { name: '100% Premium Linen', score: 0.95 },
  { name: 'Katun Rayon Twill', score: 0.90 },
  { name: 'Cotton Combed 24s', score: 0.80 },
  { name: 'Ceruty Babydoll', score: 0.75 },
  { name: 'Polyester Blend', score: 0.40 },
  { name: 'Silk Satin', score: 0.70 },
  { name: 'Fleece Tebal', score: 0.20 }
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDataset(count) {
  const dataset = [];
  for (let i = 1; i <= count; i++) {
    // Determine tier/brand
    let tier, brand, category, isModestFriendly, price;
    const rand = Math.random();
    if (rand < 0.4) {
      tier = 'functional';
      brand = getRandom(BRANDS.functional);
      price = Math.floor(Math.random() * (599 - 199) + 199) * 1000;
    } else if (rand < 0.8) {
      tier = 'modest';
      brand = getRandom(BRANDS.modest);
      price = Math.floor(Math.random() * (450 - 150) + 150) * 1000;
    } else {
      tier = 'premium';
      brand = getRandom(BRANDS.premium);
      price = Math.floor(Math.random() * (1299 - 499) + 499) * 1000;
    }

    // Determine category
    const catRand = Math.random();
    if (catRand < 0.4) category = 'atasan';
    else if (catRand < 0.7) category = 'bawahan';
    else if (catRand < 0.9) category = 'outer_hijab';
    else category = 'sepatu';

    const color = getRandom(COLORS);
    const material = getRandom(MATERIALS);

    // Modest logic
    if (tier === 'modest') isModestFriendly = true;
    else if (category === 'outer_hijab') isModestFriendly = true;
    else isModestFriendly = Math.random() > 0.5;

    // Names
    const typeNames = {
      atasan: ['Kemeja', 'Blouse', 'Tunik', 'T-Shirt', 'Knitwear'],
      bawahan: ['Celana Kulot', 'Ankle Pants', 'Rok Plisket', 'Jeans Relaxed'],
      outer_hijab: ['Pashmina', 'Voal Square', 'Cardigan', 'Blazer'],
      sepatu: ['Loafers', 'Sneakers', 'Mules', 'Flat Shoes']
    };
    const name = `${getRandom(typeNames[category])} ${material.name.split(' ')[0]} ${color.name.split(' ')[0]}`;

    // Images (Unsplash placeholders based on category)
    const imgMap = {
      atasan: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80",
      bawahan: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80",
      outer_hijab: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=500&q=80",
      sepatu: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80"
    };

    dataset.push({
      id: `g_${String(i).padStart(3, '0')}`,
      brand,
      name,
      category,
      price,
      colorHex: color.hex,
      colorName: color.name,
      material: material.name,
      breathabilityScore: material.score,
      isModestFriendly,
      gender: "female",
      imageUrl: imgMap[category],
      affiliateUrl: `https://shopee.co.id/search?keyword=${encodeURIComponent(brand + ' ' + name)}`
    });
  }
  return dataset;
}

const data = generateDataset(300);

const fileContent = `/**
 * GOLDEN DATASET: Look.u Fashion Catalog (300 Items)
 * Auto-generated highly realistic dataset for Fuzzy Logic testing.
 */

export interface GoldenGarment {
  id: string;
  brand: string;
  name: string;
  category: 'atasan' | 'bawahan' | 'outer_hijab' | 'sepatu' | 'aksesoris';
  price: number;
  colorHex: string;
  colorName: string;
  material: string;
  breathabilityScore: number;
  isModestFriendly: boolean;
  gender: 'female' | 'male' | 'unisex';
  imageUrl: string;
  affiliateUrl: string;
}

export const GOLDEN_DATASET: GoldenGarment[] = ${JSON.stringify(data, null, 2)};

export function getGarmentsByCategory(category: GoldenGarment['category']) {
  return GOLDEN_DATASET.filter(g => g.category === category);
}

export function getAllGoldenGarments() {
  return GOLDEN_DATASET;
}
`;

fs.writeFileSync('src/lib/fashion-catalog.ts', fileContent);
console.log('Successfully generated 300 items dataset!');
