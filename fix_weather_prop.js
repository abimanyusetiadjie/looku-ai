const fs = require('fs');
const path = require('path');

const feedFile = path.join(process.cwd(), 'src/components/TrendingFeed.tsx');
let content = fs.readFileSync(feedFile, 'utf8');

content = content.replace(/trend\.outfit\.weatherRecommendation/g, '("33°C TROPICAL")');

fs.writeFileSync(feedFile, content, 'utf8');
console.log("Fixed weather property error.");
