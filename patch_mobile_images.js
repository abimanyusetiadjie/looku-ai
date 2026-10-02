const fs = require('fs');
const path = require('path');

const mobileFile = path.join(process.cwd(), 'src/components/LookUMobileView.tsx');
let content = fs.readFileSync(mobileFile, 'utf8');

// 1. Slip Dress -> Hijab Modest
content = content.replace(/1515886657613-9f3515b0c78f/g, "1589156229687-496a31ad1d1f");

// 2. Tank top / Bare shoulders -> Modest Flowy Tunic
content = content.replace(/1539109136881-3be0616acf4b/g, "1618932260643-eee4a2f652a6");

// 3. Keep the men's fashion one or change to a clear men's shirt
content = content.replace(/1552374196-1ab2a1c593e8/g, "1596755094514-f87e32f85e2c");

// 4. Wide leg flowy pants -> Modest Pants
content = content.replace(/1584273143981-41c073dfe8f8/g, "1594633312681-425c7b97ccd1");

fs.writeFileSync(mobileFile, content, 'utf8');
console.log("LookUMobileView updated with modest images!");
