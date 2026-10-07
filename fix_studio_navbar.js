const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/studio/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// The regex to match the old header block
const headerRegex = /\{\/\* Studio Header Bar \*\/\}(.|\n)*?<\/header>/g;

// Replace the old header with the global Navbar, passing the specific props available in Studio
content = content.replace(headerRegex, `<Navbar 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />`);

fs.writeFileSync(file, content, 'utf8');
console.log("Navbar successfully injected into Studio page, replacing the old header.");
