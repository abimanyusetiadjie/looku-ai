const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/LookUMobileView.tsx');
let content = fs.readFileSync(file, 'utf8');

// Insert it right after `const router = useRouter();`
if (!content.includes('const { weather } = useWeather();')) {
  content = content.replace(
    'const router = useRouter();',
    'const router = useRouter();\n  const { weather } = useWeather();'
  );
}

fs.writeFileSync(file, content, 'utf8');
