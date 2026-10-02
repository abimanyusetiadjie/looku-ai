const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/LookUMobileView.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Import
if (!content.includes('useWeather')) {
  content = content.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence } from "framer-motion";\nimport { useWeather } from "@/hooks/useWeather";'
  );
}

// 2. Deklarasi Hook
if (!content.includes('const { weather } = useWeather();')) {
  content = content.replace(
    'export default function LookUMobileView({ onOpenQuiz }: LookUMobileViewProps) {',
    'export default function LookUMobileView({ onOpenQuiz }: LookUMobileViewProps) {\n  const { weather } = useWeather();'
  );
}

// 3. Replace {heroOutfit.suhu}
content = content.replace(/\{heroOutfit\.suhu\}/g, '{weather.location} {weather.temperature}°C — {weather.condition.toUpperCase()}');

// 4. Replace DATA BMKG string
content = content.replace(/DATA BMKG - UPDATE HARI INI/g, '{weather.isSimulated ? "DATA SIMULASI (LOKASI NONAKTIF)" : "SATELIT CUACA REALTIME AKTIF"}');

fs.writeFileSync(file, content, 'utf8');
