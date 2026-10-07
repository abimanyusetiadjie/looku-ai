const fs = require('fs');
const path = require('path');

const lookbookPage = path.join(process.cwd(), 'src/app/lookbook/page.tsx');
let pageContent = fs.readFileSync(lookbookPage, 'utf8');

// The error says: Property 'onSelectLook' does not exist on type 'IntrinsicAttributes & { isStandalone?: boolean | undefined; }'.
// Let's replace the whole TrendingFeed invocation.

const replaceRegex = /<TrendingFeed[\s\S]*?\/>/;
pageContent = pageContent.replace(replaceRegex, '<TrendingFeed isStandalone={true} />');

fs.writeFileSync(lookbookPage, pageContent, 'utf8');
console.log("Fixed lookbook page types.");
