'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCommunityChallenges,
  upvoteChallengeEntry,
  unvoteChallengeEntry,
  submitCommunityEntry,
  updateChallengeEntry,
  deleteChallengeEntry
} from '../lib/supabase';
import {
  Heart,
  Camera,
  MapPin,
  Sparkles,
  X,
  Check,
  UploadCloud,
  Edit3,
  Trash2,
  Image as ImageIcon,
  UserCheck,
  Palette,
  Share2
} from 'lucide-react';
import StoryShareModal from './StoryShareModal';
import { OOTDRecommendation } from '@/lib/types';

type ChallengeEntry = {
  id: string;
  user_name: string;
  location: string;
  outfit_photo: string;
  color_palette: string[];
  votes: number;
  rank: number;
  avatar: string;
};

const SAMPLE_OUTFIT_PHOTOS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
  'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80',
];

const PRESET_PALETTES = [
  ['#9CA986', '#FAF9F6', '#BA5D38'],
  ['#C2A68C', '#5A6B5C', '#181A18'],
  ['#D97706', '#FEF3C7', '#78350F'],
  ['#0284C7', '#F0F9FF', '#1E293B'],
  ['#7C3AED', '#F3E8FF', '#3B0764'],
];

export default function OOTDChallengeSection() {
  const [entries, setEntries] = useState<ChallengeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [mySubmissionIds, setMySubmissionIds] = useState<Set<string>>(new Set());

  // Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState<ChallengeEntry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingEntry, setDeletingEntry] = useState<ChallengeEntry | null>(null);
  const [storyOutfit, setStoryOutfit] = useState<OOTDRecommendation | null>(null);

  const handleShareChallengeStory = (entry: ChallengeEntry) => {
    const outfit: OOTDRecommendation = {
      id: entry.id,
      title: `OOTD Arena: ${entry.user_name}`,
      tagline: `Weekly Style Challenge Entry • ${entry.location}`,
      overallVibe: "Challenge Trendsetter",
      comfortRating: 9.5,
      affordabilityRating: 9.0,
      modestFriendly: true,
      skinToneMatch: "Cocok untuk ragam tone iklim tropis",
      whyItWorks: "Perpaduan warna palet harmonis dengan proporsi siluet modern.",
      stylingTip: `Total ${entry.votes} vote masuk di Weekly Arena. Dukung look ini di looku.ai!`,
      colorPalette: (entry.color_palette || ['#BA5D38', '#9CA986', '#FAF9F6']).map((hex, i) => ({
        name: `Tone ${i + 1}`,
        hex,
      })),
      items: [
        {
          category: "atasan",
          name: "Curated Challenge Look",
          color: entry.color_palette?.[0] || "#BA5D38",
          material: "Katun Rayon Adem",
          estimatedPrice: "Rp 149.000",
          shopeeQuery: "outfit kemeja rayon",
          tokopediaQuery: "outfit kemeja rayon",
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setStoryOutfit(outfit);
  };

  // Form State
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('Jakarta Selatan');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_OUTFIT_PHOTOS[0]);
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>(PRESET_PALETTES[0]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Load voted IDs & My submission IDs from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedVotes = localStorage.getItem('looku_voted_challenges');
        if (savedVotes) setVotedIds(new Set(JSON.parse(savedVotes)));

        const myIds = localStorage.getItem('looku_my_challenge_ids');
        if (myIds) setMySubmissionIds(new Set(JSON.parse(myIds)));
      } catch (e) {
        console.error('Error reading local storage:', e);
      }
    }

    async function fetchData() {
      const data = await getCommunityChallenges();
      const rankedData = data.map((item: any, idx: number) => ({
        ...item,
        rank: item.rank || idx + 1,
      }));
      setEntries(rankedData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Handle Vote & Unvote Toggle
  const handleVoteToggle = async (id: string) => {
    const isCurrentlyVoted = votedIds.has(id);
    const updatedVotes = new Set(votedIds);

    if (isCurrentlyVoted) {
      // Unvote (Batal Vote)
      updatedVotes.delete(id);
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, votes: Math.max(0, entry.votes - 1) } : entry
        )
      );
      setVotedIds(updatedVotes);
      if (typeof window !== 'undefined') {
        localStorage.setItem('looku_voted_challenges', JSON.stringify(Array.from(updatedVotes)));
        window.dispatchEvent(new Event('looku_profile_updated'));
      }
      await unvoteChallengeEntry(id);
    } else {
      // Vote (+1)
      updatedVotes.add(id);
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, votes: entry.votes + 1 } : entry
        )
      );
      setVotedIds(updatedVotes);
      if (typeof window !== 'undefined') {
        localStorage.setItem('looku_voted_challenges', JSON.stringify(Array.from(updatedVotes)));
        window.dispatchEvent(new Event('looku_profile_updated'));
      }
      await upvoteChallengeEntry(id);
    }
  };

  // Handle Photo File Upload (Camera / Galeri)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimum 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isEditing && editingEntry) {
        setEditingEntry({ ...editingEntry, outfit_photo: base64 });
      } else {
        setCustomPhotoBase64(base64);
        setSelectedPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Submit New Look
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    const entryId = `entry-${Date.now()}`;
    const newEntry: ChallengeEntry = {
      id: entryId,
      user_name: userName.trim(),
      location: location.trim() || 'Jakarta',
      outfit_photo: selectedPhoto,
      color_palette: selectedColors,
      votes: 1,
      rank: entries.length + 1,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (entries.length % 500)}?w=100&auto=format&fit=crop&q=80`,
    };

    await submitCommunityEntry(newEntry);

    // Track user ownership in local storage
    const updatedMyIds = new Set(mySubmissionIds).add(entryId);
    setMySubmissionIds(updatedMyIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('looku_my_challenge_ids', JSON.stringify(Array.from(updatedMyIds)));
      window.dispatchEvent(new Event('looku_profile_updated'));
    }

    setEntries((prev) => [newEntry, ...prev]);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setUserName('');
      setCustomPhotoBase64(null);
    }, 1500);
  };

  // Handle Edit Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setIsUpdating(true);
    await updateChallengeEntry(editingEntry.id, {
      user_name: editingEntry.user_name,
      location: editingEntry.location,
      outfit_photo: editingEntry.outfit_photo,
      color_palette: editingEntry.color_palette,
    });

    setEntries((prev) =>
      prev.map((item) => (item.id === editingEntry.id ? editingEntry : item))
    );
    setIsUpdating(false);
    setEditingEntry(null);
  };

  // Handle Delete Submission
  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return;

    const idToDelete = deletingEntry.id;
    await deleteChallengeEntry(idToDelete);

    // Remove from entries
    setEntries((prev) => prev.filter((item) => item.id !== idToDelete));

    // Remove from mySubmissionIds
    const updatedMyIds = new Set(mySubmissionIds);
    updatedMyIds.delete(idToDelete);
    setMySubmissionIds(updatedMyIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('looku_my_challenge_ids', JSON.stringify(Array.from(updatedMyIds)));
    }

    setDeletingEntry(null);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 text-[10px] font-mono font-extrabold px-3 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1.5 aura-glow-gold animate-pulse">
            <span>👑</span>
            <span>JUARA 1 ARENA</span>
          </span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md border border-slate-300 flex items-center gap-1.5">
            <span>🥈</span>
            <span>JUARA 2</span>
          </span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md border border-amber-700 flex items-center gap-1.5">
            <span>🥉</span>
            <span>JUARA 3</span>
          </span>
        </div>
      );
    return (
      <span className="bg-charcoal-900/80 text-sand-50 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full absolute top-2.5 left-2.5 z-10 backdrop-blur-md">
        #{rank}
      </span>
    );
  };

  return (
    <section id="challenge" className="py-16 bg-[#F4EFE6] border-y border-[#E8DFD1] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-terracotta-200 text-terracotta-700 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span>WEEKLY STYLE ARENA</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-charcoal-900 tracking-tight">
            ✦ OOTD Challenge: <span className="italic text-terracotta-600">#EarthyTropisChallenge</span>
          </h2>

          <p className="text-xs sm:text-sm text-sand-500 max-w-xl mx-auto">
            Kurasi foto OOTD bernuansa alam & iklim tropis. Top 3 Look terfavorit mendapatkan voucher belanja marketplace Rp 500.000!
          </p>

          <div className="pt-1 flex items-center justify-center gap-4 text-xs font-mono text-charcoal-900">
            <span className="bg-white px-3 py-1 rounded-full border border-sand-300 shadow-2xs font-bold">
              ⏳ Sisa 3 Hari Lagi
            </span>
            <span className="text-sand-500">• 14.8k Total Vote Masuk</span>
          </div>
        </div>

        {/* Leaderboard Grid (2-Column Mobile Feed / 5-Column Desktop) */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-terracotta-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-5">
            <AnimatePresence>
              {entries.map((entry, index) => {
                const isMyLook = mySubmissionIds.has(entry.id);
                const isVoted = votedIds.has(entry.id);

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden relative group border transition-all flex flex-col justify-between ${
                      entry.rank === 1
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl aura-glow-gold'
                        : entry.rank === 2
                        ? 'border-slate-300 ring-1 ring-slate-200 shadow-md'
                        : entry.rank === 3
                        ? 'border-amber-700/40 shadow-md'
                        : isMyLook
                        ? 'border-terracotta-500 ring-2 ring-terracotta-500/20'
                        : 'border-[#E8DFD1] hover:shadow-md'
                    }`}
                  >
                    {getRankBadge(entry.rank)}

                    {/* Owner Badge */}
                    {isMyLook && (
                      <span className="bg-charcoal-900 text-white text-[8px] sm:text-[9px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 shadow-sm flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5 text-terracotta-400" />
                        <span>MILIKMU</span>
                      </span>
                    )}

                    {/* Photo */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
                      <img
                        src={entry.outfit_photo}
                        alt={`Outfit by ${entry.user_name}`}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                      />

                      {/* Color Palette Overlay */}
                      <div className="absolute bottom-2 right-2 flex gap-1 p-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xs">
                        {entry.color_palette.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5 sm:p-3.5 space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={entry.avatar}
                          alt={entry.user_name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-sand-300 shadow-2xs shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-charcoal-900 text-[11px] sm:text-xs truncate leading-tight">
                            {entry.user_name}
                          </h4>
                          <p className="text-[9px] sm:text-[10px] text-sand-500 flex items-center gap-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 text-terracotta-500 shrink-0" />
                            <span className="truncate">{entry.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons: Vote / Unvote & Share */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleVoteToggle(entry.id)}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                            isVoted
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-sand-100 text-charcoal-900 hover:bg-rose-50 hover:text-rose-600 border border-sand-200'
                          }`}
                        >
                          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isVoted ? 'fill-current' : ''}`} />
                          <span>{entry.votes.toLocaleString()} {isVoted ? 'Disukai' : 'Vote'}</span>
                        </button>

                        <button
                          onClick={() => handleShareChallengeStory(entry)}
                          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-200 text-charcoal-900 transition-colors shadow-2xs"
                          title="Bagikan ke Instagram Story (9:16)"
                        >
                          <Share2 className="w-3.5 h-3.5 text-terracotta-600" />
                        </button>
                      </div>

                      {/* Owner CRUD Actions: Edit & Delete */}
                      {isMyLook && (
                        <div className="pt-2 border-t border-sand-200 flex gap-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="flex-1 py-1.5 rounded-lg bg-sand-100 hover:bg-charcoal-900 hover:text-white text-charcoal-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingEntry(entry)}
                            className="flex-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* CTA to Upload */}
        <div className="mt-12 text-center">
          <motion.button
            onClick={() => setIsSubmitModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold py-3.5 px-8 rounded-full shadow-md flex items-center gap-2.5 mx-auto transition-all text-xs uppercase tracking-wider"
          >
            <Camera className="w-4 h-4 text-terracotta-400" />
            <span>Ikutan Challenge & Submit Look Kamu</span>
          </motion.button>
        </div>
      </div>

      {/* Hidden File Input for Camera/Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, false)}
      />
      <input
        type="file"
        ref={editFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, true)}
      />

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-terracotta-500 text-base">✦</span>
                  <h3 className="font-serif font-bold text-lg text-charcoal-900">
                    Ikutan #EarthyTropisChallenge
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-full text-sand-500 hover:text-charcoal-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-charcoal-900">
                    Look Berhasil Masuk Leaderboard! 🎉
                  </h4>
                  <p className="text-xs text-sand-500">
                    Outfit kamu sekarang aktif dan dapat kamu edit atau hapus kapan saja.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block mb-1">
                      Nama Kamu / Alias
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Maya Anggraeni"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block mb-1">
                      Kota Domisili
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bandung / Jakarta Selatan"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    />
                  </div>

                  {/* Foto Upload & Preset Picker */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block">
                      Foto Setelan Outfit (Pilih dari Kamera/Galeri atau Preset)
                    </label>

                    {/* Camera & Gallery Upload Button */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-terracotta-400" />
                        <span>Upload dari Kamera / Galeri</span>
                      </button>
                    </div>

                    {/* Preview Selected Photo */}
                    {selectedPhoto && (
                      <div className="p-2 bg-sand-50 rounded-xl border border-sand-200 flex items-center gap-3">
                        <img
                          src={selectedPhoto}
                          alt="Preview"
                          className="w-12 h-14 rounded-lg object-cover border border-sand-300"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-charcoal-900 block">Foto Terpilih</span>
                          <span className="text-[10px] text-sand-500 font-mono">
                            {customPhotoBase64 ? 'Foto Pribadi Diunggah' : 'Koleksi Preset Terpilih'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Preset Photos Grid */}
                    <div className="text-[10px] font-mono text-sand-500 font-bold pt-1">
                      ATAU PILIH PRESET OOTD TROPIS:
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {SAMPLE_OUTFIT_PHOTOS.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(photo);
                            setCustomPhotoBase64(null);
                          }}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            selectedPhoto === photo && !customPhotoBase64
                              ? 'border-terracotta-500 scale-105 shadow-xs'
                              : 'border-sand-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block">
                      Palet Warna Dominan
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_PALETTES.map((pal, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColors(pal)}
                          className={`p-1.5 rounded-xl border flex gap-1 items-center justify-center transition-all ${
                            selectedColors === pal
                              ? 'border-charcoal-900 bg-sand-100 shadow-2xs'
                              : 'border-sand-200 hover:border-sand-400'
                          }`}
                        >
                          {pal.map((c, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Memproses Look...</span>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Kirim Look ke Leaderboard ↗</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Submission Modal */}
      <AnimatePresence>
        {editingEntry && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingEntry(null)}
              className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-terracotta-500" />
                  <h3 className="font-serif font-bold text-lg text-charcoal-900">
                    Edit Look Kamu
                  </h3>
                </div>
                <button
                  onClick={() => setEditingEntry(null)}
                  className="p-1 rounded-full text-sand-500 hover:text-charcoal-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block mb-1">
                    Nama / Alias
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.user_name}
                    onChange={(e) => setEditingEntry({ ...editingEntry, user_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block mb-1">
                    Kota Domisili
                  </label>
                  <input
                    type="text"
                    value={editingEntry.location}
                    onChange={(e) => setEditingEntry({ ...editingEntry, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                {/* Change Photo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block">
                    Ganti Foto Outfit
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingEntry.outfit_photo}
                      alt="Preview"
                      className="w-14 h-16 rounded-xl object-cover border border-sand-300 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="py-2 px-4 rounded-xl bg-sand-100 hover:bg-charcoal-900 hover:text-white text-charcoal-900 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Unggah Foto Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {SAMPLE_OUTFIT_PHOTOS.slice(0, 5).map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditingEntry({ ...editingEntry, outfit_photo: photo })}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          editingEntry.outfit_photo === photo
                            ? 'border-terracotta-500 scale-105 shadow-xs'
                            : 'border-sand-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="flex-1 py-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingEntry && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingEntry(null)}
              className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-sand-300 z-10 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Hapus Look dari Leaderboard?
                </h3>
                <p className="text-xs text-sand-500 mt-1">
                  Look &ldquo;{deletingEntry.user_name}&rdquo; akan dihapus permanen dari kompetisi minggu ini.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingEntry(null)}
                  className="flex-1 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Story Share Modal */}
      {storyOutfit && (
        <StoryShareModal
          outfit={storyOutfit}
          onClose={() => setStoryOutfit(null)}
        />
      )}
    </section>
  );
}
