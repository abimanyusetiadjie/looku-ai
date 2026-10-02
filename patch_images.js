const fs = require('fs');
const path = require('path');

const heroFile = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let heroContent = fs.readFileSync(heroFile, 'utf8');

// Replace Hero Backgrounds (Desktop and Mobile) from Slip Dress to Modest/Hijab Elegance
heroContent = heroContent.replace(
  /https:\/\/images\.unsplash\.com\/photo-1515886657613-9f3515b0c78f/g, 
  "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
);

// Replace Grid Images and text to be strictly modest
heroContent = heroContent.replace(
  /https:\/\/images\.unsplash\.com\/photo-1543163521-1bf539c55dd2/g,
  "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c"
); // Camp Collar Shirt

heroContent = heroContent.replace(
  /https:\/\/images\.unsplash\.com\/photo-1584273143981-41c073dfe8f8/g,
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"
); // Flowy Pants

heroContent = heroContent.replace(
  /https:\/\/images\.unsplash\.com\/photo-1512436991641-6745cdb1723f/g,
  "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f"
); // Voal Hijab

// Replace "Ribbed Knit Tank" (Revealing) to "Tunik Rayon Panjang" (Modest)
heroContent = heroContent.replace(
  /https:\/\/images\.unsplash\.com\/photo-1551803091-e20673f15770/g,
  "https://images.unsplash.com/photo-1509631179647-0c115738ee05"
);
heroContent = heroContent.replace(/Ribbed Knit Tank/g, "Tunik Rayon Panjang");
heroContent = heroContent.replace(/Inner/g, "Tops");

fs.writeFileSync(heroFile, heroContent, 'utf8');
console.log("HeroSection updated with modest images!");
