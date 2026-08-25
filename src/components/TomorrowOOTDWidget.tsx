import React from "react";
import { CloudRain, Sun, ThermometerSun, Wind } from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";

interface TomorrowOOTDWidgetProps {
  onScheduleTomorrow: (outfit: any) => void; // Simplified type for outfit
}

export default function TomorrowOOTDWidget({ onScheduleTomorrow }: TomorrowOOTDWidgetProps) {
  // Simulate tomorrow's weather
  const weather = {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    text: "☀️ Besok: 34°C Panas Terik Siang Hari"
  };

  const handleSchedule = () => {
    onScheduleTomorrow({}); // Empty object for mock outfit, or mock data
  };

  return (
    <div className="w-full bg-gradient-to-br from-sand-100 to-white border border-sand-300 rounded-3xl p-5 shadow-tactile relative overflow-hidden group mb-8">
      {/* Background Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-100/50 text-amber-800 text-[10px] font-mono font-bold tracking-wider uppercase border border-amber-200/50 flex items-center gap-1.5 w-fit">
              {weather.text}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-100/50 text-blue-800 text-[10px] font-mono font-bold tracking-wider uppercase border border-blue-200/50 flex items-center gap-1.5 w-fit">
              <Wind className="w-3 h-3" />
              98.6% Optimal Airflow
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight">
              Formula Anti-Gerah Besok Pagi
            </h3>
            <p className="text-sm font-medium text-charcoal-900/80 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
              Kemeja Linen Crinkle + Highwaist Loose Kulot Broken White
            </p>
          </div>
        </div>

        <button
          onClick={handleSchedule}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-charcoal-900 hover:bg-terracotta-600 text-sand-50 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <ThermometerSun className="w-4 h-4" />
          <span>📌 Kunci OOTD Besok Pagi & Simpan ke Lemari</span>
        </button>
      </div>
    </div>
  );
}
