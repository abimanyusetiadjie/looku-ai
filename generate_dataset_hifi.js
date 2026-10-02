const fs = require('fs');

const BRANDS = {
  functional: ['Uniqlo', 'Muji', 'Marks & Spencer'],
  modest: ['Vanilla Hijab', 'Klamby', 'Kami Idea', 'Cottonink', 'Buttonscarves'],
  premium: ['Zara', 'Mango', 'H&M', 'Massimo Dutti'],
  casual: ['Erigo', 'Roughneck', '3Second']
};

const COLORS = [
  { hex: '#FFFFFF', name: 'Broken White', tone: ['fair', 'light', 'medium', 'tan', 'deep'] },
  { hex: '#1C1C1C', name: 'Onyx Black', tone: ['fair', 'light', 'medium', 'tan', 'deep'] },
  { hex: '#F5F5DC', name: 'Oat Beige', tone: ['medium', 'tan', 'deep'] },
  { hex: '#84A98C', name: 'Sage Green', tone: ['fair', 'light', 'medium'] },
  { hex: '#C69C6D', name: 'Camel Mocca', tone: ['light', 'medium', 'tan'] },
  { hex: '#5D6D7E', name: 'Steel Blue', tone: ['fair', 'light', 'deep'] }
];

const MATERIALS = [
  { name: '100% Premium Linen', score: 0.95 },
  { name: 'Katun Rayon Twill', score: 0.90 },
  { name: 'Cotton Combed 24s', score: 0.80 },
  { name: 'Ceruty Babydoll', score: 0.75 },
  { name: 'Polyester Blend', score: 0.40 },
  { name: 'Silk Satin', score: 0.70 }
];

// HIGH-FIDELITY IMAGE MAPPING
const IMAGE_POOLS = {
  "T-Shirt": [
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80", // Black T-shirt
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", // White T-shirt
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"  // Casual Tee
  ],
  "Kemeja": [
    "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80", // Linen shirt
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80", // Button down
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"  // Casual shirt
  ],
  "Blazer": [
    "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80", // Blazer
    "https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=600&q=80"  // Formal jacket
  ],
  "Pashmina": [
    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&q=80", // Hijab
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80", // Modest wear
    "https://images.unsplash.com/photo-1509631179647-0c115738ee05?w=600&q=80"  // Modest fashion
  ],
  "Tunik": [
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80", // Modest flowy dress
    "https://images.unsplash.com/photo-1515347619152-169542a1f49c?w=600&q=80"  // Flowy long
  ],
  "Celana": [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80", // Pants
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"  // Jeans
  ],
  "Rok": [
    "https://images.unsplash.com/photo-1583496661160-c5dcb4c6f58f?w=600&q=80", // Skirt
    "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80"  // Flowy skirt
  ],
  "Sepatu": [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", // Shoes
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80"  // Sneakers
  ]
};

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

    // Type definition and High-Fidelity Image Selection
    let itemType = '';
    if (category === 'atasan') {
      itemType = getRandom(['Kemeja', 'T-Shirt', 'Tunik', 'Blazer']);
    } else if (category === 'bawahan') {
      itemType = getRandom(['Celana', 'Rok']);
    } else if (category === 'outer_hijab') {
      itemType = 'Pashmina';
    } else {
      itemType = 'Sepatu';
    }

    const name = `${itemType} ${material.name.split(' ')[0]} ${color.name.split(' ')[0]}`;
    
    // Select specific image matching the exact itemType!
    const pool = IMAGE_POOLS[itemType] || IMAGE_POOLS["T-Shirt"];
    const imageUrl = getRandom(pool);

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
      imageUrl: imageUrl,
      affiliateUrl: `https://shopee.co.id/search?keyword=${encodeURIComponent(brand + ' ' + name)}`
    });
  }
  return dataset;
}

const data = generateDataset(300);

const fileContent = `/**
 * GOLDEN DATASET: Look.u Fashion Catalog (300 Items)
 * Auto-generated highly realistic dataset for Fuzzy Logic testing.
 * HIGH-FIDELITY: Images are precisely mapped to their clothing types.
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
console.log('Successfully regenerated 300 items dataset with High-Fidelity Image Mapping!');
