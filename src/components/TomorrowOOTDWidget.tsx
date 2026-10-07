"use client";

import React from "react";
import { ThermometerSun } from "lucide-react";

interface TomorrowOOTDWidgetProps {
  onScheduleTomorrow: (outfit: any) => void;
}

export default function TomorrowOOTDWidget({ onScheduleTomorrow }: TomorrowOOTDWidgetProps) {
  return (
    <div className="w-full bg-white border border-sand-300 p-6 relative overflow-hidden mb-6">
      <div className="space-y-4">
        <div>
          <div className="text-[11px] font-mono text-charcoal-900 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
            <ThermometerSun className="w-3.5 h-3.5" />
            Besok · 34°C · Panas Terik
          </div>
          <div className="text-[11px] font-mono text-sand-500 uppercase tracking-widest">
            Material: Katun Airflow
          </div>
        </div>

        <div>
          <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight mb-1">
            Formula Anti-Gerah
          </h3>
          <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
            Kemeja Linen Crinkle +<br />Highwaist Loose Kulot
          </p>
        </div>

        <button
          onClick={() => onScheduleTomorrow({})}
          className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white font-sans font-bold text-[10px] tracking-widest uppercase transition-colors"
        >
          Kunci OOTD Besok
        </button>
      </div>
    </div>
  );
}
