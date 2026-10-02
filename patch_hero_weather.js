const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Tambah import di bagian atas
if (!content.includes('useWeather')) {
  content = content.replace(
    'import { motion } from "framer-motion";',
    'import { motion } from "framer-motion";\nimport { useWeather } from "@/hooks/useWeather";'
  );
}

// 2. Tambah deklarasi hook di dalam komponen HeroSection
if (!content.includes('const { weather } = useWeather();')) {
  content = content.replace(
    'export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {',
    'export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {\n  const { weather } = useWeather();'
  );
}

fs.writeFileSync(file, content, 'utf8');
