import type { OutfitItem } from "@/lib/types";

/**
 * Breathability scoring — Look.u "Weather-Aware Curated Closet" logic.
 *
 * Each fabric gets a base airflow score (0–100) derived from common textile
 * properties (fibre type + typical weave). The look score is the average of its
 * items, then adjusted for the current temperature: above 30°C, heavy fabrics
 * are penalised harder because heat stress grows non-linearly.
 */
const FABRIC_SCORES: { match: RegExp; score: number; trait: string }[] = [
  { match: /linen|crinkle|airflow/i, score: 97, trait: "Highly breathable" },
  { match: /tencel|modal|lyocell/i, score: 95, trait: "Moisture-wicking" },
  { match: /voal|voile/i, score: 92, trait: "Lightweight" },
  { match: /katun|cotton|combed/i, score: 91, trait: "Sweat-absorbent" },
  { match: /rayon|viscose/i, score: 90, trait: "Cool-touch drape" },
  { match: /chiffon|ceruty|sifon/i, score: 86, trait: "Airy layering" },
  { match: /silk|satin|sutra/i, score: 78, trait: "Smooth finish" },
  { match: /denim|jeans/i, score: 68, trait: "Structured" },
  { match: /knit|rajut|wool|wol/i, score: 62, trait: "Insulating" },
  { match: /polyester|nylon|scuba|jersey/i, score: 58, trait: "Low airflow" },
  { match: /leather|kulit|pu\b/i, score: 50, trait: "Low airflow" },
];

const DEFAULT_SCORE = 80;

export interface BreathabilityResult {
  score: number;          // 0–100
  traits: string[];       // unique, human-readable fabric traits
  verdict: string;        // one-line AI recommendation
  isModest: boolean;      // has a hijab/outer layer or long bottom
}

export function scoreItem(item: OutfitItem): { score: number; trait?: string } {
  const text = `${item.material} ${item.name}`;
  const hit = FABRIC_SCORES.find((f) => f.match.test(text));
  return hit ? { score: hit.score, trait: hit.trait } : { score: DEFAULT_SCORE };
}

export function computeBreathability(items: OutfitItem[], temperature = 33): BreathabilityResult {
  if (items.length === 0) {
    return { score: 0, traits: [], verdict: "Tambahkan item ke kanvas untuk melihat analisis.", isModest: false };
  }

  const scored = items.map(scoreItem);
  let score = scored.reduce((sum, s) => sum + s.score, 0) / scored.length;

  // Heat penalty: every degree above 30°C amplifies the gap from a perfect 100.
  if (temperature > 30) {
    const heatFactor = 1 + (temperature - 30) * 0.04;
    score = 100 - (100 - score) * heatFactor;
  }
  score = Math.max(0, Math.min(100, Math.round(score)));

  const traits = Array.from(new Set(scored.map((s) => s.trait).filter(Boolean) as string[])).slice(0, 4);
  const isModest = items.some(
    (i) => i.category === "outer_hijab" || /kulot|culotte|wide|maxi|long|panjang|rok/i.test(i.name)
  );
  if (isModest) traits.push("Modest coverage");

  let verdict: string;
  if (score >= 90) {
    verdict = `Ideal untuk ${temperature}°C. Serat alami menjaga tubuh tetap sejuk sepanjang hari.`;
  } else if (score >= 75) {
    verdict = `Cukup nyaman untuk ${temperature}°C. Pilih ruangan ber-AC untuk aktivitas siang.`;
  } else {
    const heaviest = items[scored.findIndex((s) => s.score === Math.min(...scored.map((x) => x.score)))];
    verdict = `Kurang ideal untuk ${temperature}°C. Coba ganti "${heaviest.name}" dengan bahan linen atau katun.`;
  }

  return { score, traits, verdict, isModest };
}
