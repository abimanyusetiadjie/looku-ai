import React from "react";
import { CloudRain, Sun, ThermometerSun, Wind } from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";

interface TomorrowOOTDWidgetProps {
  onScheduleTomorrow: (outfit: any) => void; // Simplified type for outfit
}

export default function TomorrowOOTDWidget({ onScheduleTomorrow }: TomorrowOOTDWidgetProps) {
  const weatherText = "BESOK: 34°C PANAS TERIK SIANG";

  const handleSchedule = () => {
    onScheduleTomorrow({});
  };

  return (
    <div className="w-full bg-white border border-sand-300 rounded-3xl p-5 shadow-sm relative overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-900 text-[10px] font-mono font-bold tracking-wider uppercase border border-sand-200 flex items-center gap-1.5 w-fit">
              <Sun className="w-3 h-3 text-amber-600" />
              {weatherText}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-900 text-[10px] font-mono font-semibold tracking-wider uppercase border border-sand-200 flex items-center gap-1 w-fit">
              <Wind className="w-3 h-3 text-emerald-700" />
              Sirkulasi Katun
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">
              Formula Anti-Gerah Besok Pagi
            </h3>
            <p className="text-xs font-medium text-charcoal-700 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
              Kemeja Linen Crinkle + Highwaist Loose Kulot Broken White
            </p>
          </div>
        </div>

        <button
          onClick={handleSchedule}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <ThermometerSun className="w-3.5 h-3.5" />
          <span>Kunci OOTD Besok</span>
        </button>
      </div>
    </div>
  );
}
