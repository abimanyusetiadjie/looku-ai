const fs = require('fs');
const path = require('path');

const navbarFile = path.join(process.cwd(), 'src/components/Navbar.tsx');
let content = fs.readFileSync(navbarFile, 'utf8');

// Import useRouter
if (!content.includes('useRouter')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
}

// Add router inside the component
if (!content.includes('const router = useRouter()')) {
  content = content.replace('const [mobileMenuOpen, setMobileMenuOpen] = useState(false);', 'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const router = useRouter();');
}

// Replace the onClick handlers to have fallbacks
content = content.replace('onClick={onOpenCatalog}', 'onClick={() => onOpenCatalog ? onOpenCatalog() : router.push("/lookbook")}');
content = content.replace('onClick={onOpenSavedDrawer}', 'onClick={() => onOpenSavedDrawer ? onOpenSavedDrawer() : router.push("/lemari")}');

fs.writeFileSync(navbarFile, content, 'utf8');
console.log("Navbar modified to support fallback routing.");
