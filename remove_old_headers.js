const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/studio/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Sleek Minimal Desktop Header \(Hidden on Mobile\) \*\/\}(.|\n)*?(?=\{\/\* Top Header Bar Minimalist Beige \*\/\})/g;

if (content.match(regex)) {
  content = content.replace(regex, "");
  fs.writeFileSync(file, content, 'utf8');
  console.log("Old headers successfully deleted.");
} else {
  console.log("Could not find the headers to delete. Please check regex.");
}
