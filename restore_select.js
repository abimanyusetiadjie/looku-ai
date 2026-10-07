const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/lookbook/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// We need to re-add onSelectLook={handleSelectLook}
content = content.replace(
  /<TrendingFeed isStandalone=\{true\} \/>/g,
  '<TrendingFeed isStandalone={true} onSelectLook={handleSelectLook} />'
);

fs.writeFileSync(pageFile, content, 'utf8');
console.log("Restored onSelectLook routing to Studio.");
