import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Pin, X, Bookmark, ArrowUpRight, Cloud, Check } from 'lucide-react';
import { OOTDRecommendation } from '@/lib/types';
import { syncLocalCalendarToCloud } from '@/lib/supabase';

interface WeeklyOutfitCalendarProps {
  currentOutfit?: OOTDRecommendation;
  onClose?: () => void;
  onSelectDayOutfit?: (outfit: OOTDRecommendation) => void;
}

const DAYS = [
  { id: 0, day: 'Senin', weather: '☀️ 33°C', mood: 'Smart SCBD / Kantor' },
  { id: 1, day: 'Selasa', weather: '☀️ 34°C', mood: 'Earthy Linen / Kuliah' },
  { id: 2, day: 'Rabu', weather: '☁️ 30°C', mood: 'Cafe Hopping / Meeting' },
  { id: 3, day: 'Kamis', weather: '☀️ 32°C', mood: 'Minimalist Slacks' },
  { id: 4, day: 'Jumat', weather: '🌧️ 27°C', mood: 'Batik Modern / Layering' },
  { id: 5, day: 'Sabtu', weather: '☀️ 33°C', mood: 'Kondangan Silk / Date' },
  { id: 6, day: 'Minggu', weather: '☀️ 34°C', mood: 'Relaxed Casual / Santai' },
];

export default function WeeklyOutfitCalendar({
  currentOutfit,
  onClose,
  onSelectDayOutfit,
}: WeeklyOutfitCalendarProps) {
  const [weeklyPlan, setWeeklyPlan] = useState<Record<number, OOTDRecommendation | null>>({});
  const [savedWardrobe, setSavedWardrobe] = useState<OOTDRecommendation[]>([]);
  const [pickingForDayId, setPickingForDayId] = useState<number | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('looku_weekly_calendar');
      if (stored) {
        setWeeklyPlan(JSON.parse(stored));
      }
      const wardrobe = localStorage.getItem('looku_saved_outfits');
      if (wardrobe) {
        setSavedWardrobe(JSON.parse(wardrobe));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToPlan = async (dayId: number, outfit: OOTDRecommendation | null) => {
    const updated = { ...weeklyPlan, [dayId]: outfit };
    setWeeklyPlan(updated);
    try {
      localStorage.setItem('looku_weekly_calendar', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    await syncLocalCalendarToCloud(updated);
  };

  const assignCurrentOutfit = (dayId: number) => {
    if (currentOutfit) {
      saveToPlan(dayId, currentOutfit);
    }
  };

  const removeOutfit = (dayId: number) => {
    saveToPlan(dayId, null);
  };

  const handleSelectFromWardrobe = (dayId: number, outfit: OOTDRecommendation) => {
    saveToPlan(dayId, outfit);
    setPickingForDayId(null);
  };

  const handleCloudSyncClick = async () => {
    setIsCloudSyncing(true);
    await syncLocalCalendarToCloud(weeklyPlan);
    setIsCloudSyncing(false);
    setCloudSynced(true);
    setTimeout(() => setCloudSynced(false), 3000);
  };

  const shareSchedule = () => {
    const plannedDays = DAYS.filter((d) => weeklyPlan[d.id]);
    if (plannedDays.length === 0) return;

    let text = `📅 *Jadwal OOTD Mingguan - look.u AI*\n\n`;
    plannedDays.forEach((d) => {
      const outfit = weeklyPlan[d.id]!;
      text += `*${d.day}* (${d.weather} • ${d.mood})\n`;
      text += `🧥 ${outfit.title}\n\n`;
    });

    text += `Rencanakan outfitmu di https://looku.ai`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filledDaysCount = Object.values(weeklyPlan).filter(Boolean).length;
  const progressPercent = Math.round((filledDaysCount / 7) * 100);

  return (
    <div className="w-full bg-white border border-sand-200 rounded-3xl shadow-tactile p-6 relative overflow-hidden">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-900 hover:bg-sand-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal-900">7-Day OOTD Planner</h2>
          <p className="text-xs text-sand-500">Rencanakan outfit mingguanmu agar bebas pusing setiap pagi.</p>
        </div>

        <button
          onClick={handleCloudSyncClick}
          className="px-3 py-1.5 rounded-xl bg-sand-100 hover:bg-charcoal-900 hover:text-white text-charcoal-900 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          {cloudSynced ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Cloud className="w-3.5 h-3.5" />}
          <span>{isCloudSyncing ? "Menyinkronkan..." : cloudSynced ? "Tersinkron Cloud" : "Sync Cloud"}</span>
        </button>
      </div>

      <div className="mb-6 bg-sand-50 p-4 rounded-2xl border border-sand-200 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold font-mono uppercase text-charcoal-900">Kesiapan Mingguan</span>
            <span className="text-xs font-bold font-mono text-terracotta-600">
              {filledDaysCount} / 7 Hari Terencana ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-terracotta-500 rounded-full"
            />
          </div>
        </div>
        <button
          onClick={shareSchedule}
          disabled={filledDaysCount === 0}
          className="shrink-0 p-2.5 rounded-xl bg-charcoal-900 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          title="Bagikan Jadwal Mingguan via WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {DAYS.map((day) => {
          const outfit = weeklyPlan[day.id];
          const isCurrentDay = new Date().getDay() === (day.id === 6 ? 0 : day.id + 1);

          return (
            <motion.div
              key={day.id}
              layout
              className={`p-4 rounded-2xl border transition-all ${
                outfit ? 'bg-sand-50 border-sand-300' : 'bg-white border-sand-200 border-dashed hover:border-sand-400'
              } ${isCurrentDay ? 'ring-2 ring-terracotta-500/50' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-charcoal-900 w-16">{day.day}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand-100 text-charcoal-800 border border-sand-200">
                      {day.weather}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200 truncate">
                      {day.mood}
                    </span>
                  </div>

                  {outfit ? (
                    <div className="mt-2 flex items-center justify-between bg-white p-2.5 rounded-xl border border-sand-200 shadow-sm">
                      <div
                        onClick={() => onSelectDayOutfit && onSelectDayOutfit(outfit)}
                        className="flex items-center gap-3 cursor-pointer group/item flex-1 overflow-hidden"
                      >
                        <div className="flex -space-x-2">
                          {outfit.colorPalette?.slice(0, 3).map((c: any, i: number) => {
                            const hex = typeof c === 'string' ? c : c.hex;
                            return (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0"
                                style={{ backgroundColor: hex }}
                              />
                            );
                          })}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-charcoal-900 group-hover/item:text-terracotta-600 truncate flex items-center gap-1">
                            <span>{outfit.title}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </p>
                          <p className="text-[10px] font-mono text-sand-500 truncate">{outfit.overallVibe}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeOutfit(day.id)}
                        className="p-1.5 text-sand-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                        title="Hapus Outfit dari Hari Ini"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {currentOutfit && (
                        <button
                          onClick={() => assignCurrentOutfit(day.id)}
                          className="text-xs font-bold bg-white hover:bg-terracotta-50 text-terracotta-600 border border-terracotta-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Pin className="w-3.5 h-3.5" />
                          <span>Pasang Outfit Studio</span>
                        </button>
                      )}

                      {savedWardrobe.length > 0 && (
                        <button
                          onClick={() => setPickingForDayId(pickingForDayId === day.id ? null : day.id)}
                          className="text-xs font-bold bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-sand-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Pilih dari Lemari ({savedWardrobe.length})</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Wardrobe Selector Dropdown for Day */}
                  <AnimatePresence>
                    {pickingForDayId === day.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 bg-sand-100 rounded-2xl border border-sand-300 space-y-2 overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-charcoal-900">
                          <span>Pilih Outfit dari Lemari untuk {day.day}:</span>
                          <button
                            onClick={() => setPickingForDayId(null)}
                            className="text-sand-500 hover:text-charcoal-900"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                          {savedWardrobe.map((saved) => (
                            <button
                              key={saved.id}
                              onClick={() => handleSelectFromWardrobe(day.id, saved)}
                              className="p-2 bg-white hover:bg-charcoal-900 hover:text-white rounded-xl text-left border border-sand-200 text-xs font-semibold truncate transition-colors flex items-center justify-between gap-1 shadow-2xs"
                            >
                              <span className="truncate">{saved.title}</span>
                              <ArrowUpRight className="w-3 h-3 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filledDaysCount > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={shareSchedule}
            className="px-5 py-3 rounded-2xl bg-charcoal-900 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md w-full"
          >
            <Share2 className="w-4 h-4" />
            <span>💬 Bagikan Jadwal Mingguan via WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}
