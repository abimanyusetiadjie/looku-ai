const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/components/Navbar.tsx');
let content = fs.readFileSync(file, 'utf8');

const navItemsArray = `[
  { name: 'Home', href: '/' },
  { name: 'Studio', href: '/studio' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Wardrobe', href: '/lemari' }
]`;

// Replace desktop map
content = content.replace(
  /\{\['Shop', 'New', 'Collections', 'Editorial'\]\.map\(\(item\) => \(\s*<Link key=\{item\} href=\{`\/\#\$\{item\.toLowerCase\(\)\}`\}/g,
  `{${navItemsArray}.map((item) => (\n                <Link key={item.name} href={item.href}`
);
content = content.replace(
  /\{item\}\s*<\/Link>/g,
  '{item.name}\n                </Link>'
);

// Replace mobile map
content = content.replace(
  /\{\['Shop', 'New', 'Collections', 'Editorial'\]\.map\(\(item\) => \(\s*<Link key=\{item\} href=\{`\/\#\$\{item\.toLowerCase\(\)\}`\}/g,
  `{${navItemsArray}.map((item) => (\n                  <Link key={item.name} href={item.href}`
);

fs.writeFileSync(file, content, 'utf8');
