import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock Data for offline fallback
const MOCK_LEADERBOARD = [
  {
    id: '1',
    user_name: 'Aisha Kirana',
    location: 'Jakarta',
    outfit_photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    color_palette: ['#EAE2B7', '#D62828', '#003049'],
    votes: 1240,
    rank: 1,
    avatar: 'https://i.pravatar.cc/150?u=aisha'
  },
  {
    id: '2',
    user_name: 'Bima Santoso',
    location: 'Bandung',
    outfit_photo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    color_palette: ['#4A4E69', '#9A8C98', '#F2E9E4'],
    votes: 1050,
    rank: 2,
    avatar: 'https://i.pravatar.cc/150?u=bima'
  },
  {
    id: '3',
    user_name: 'Citra Dewi',
    location: 'Surabaya',
    outfit_photo: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
    color_palette: ['#2A9D8F', '#E9C46A', '#F4A261'],
    votes: 890,
    rank: 3,
    avatar: 'https://i.pravatar.cc/150?u=citra'
  },
  {
    id: '4',
    user_name: 'Reza Pratama',
    location: 'Jogja',
    outfit_photo: 'https://images.unsplash.com/photo-1529139574466-a303027c028b?w=400&q=80',
    color_palette: ['#8D99AE', '#2B2D42', '#EDF2F4'],
    votes: 750,
    rank: 4,
    avatar: 'https://i.pravatar.cc/150?u=reza'
  },
  {
    id: '5',
    user_name: 'Sari Ayu',
    location: 'Medan',
    outfit_photo: 'https://images.unsplash.com/photo-1509631179647-0c7104e76963?w=400&q=80',
    color_palette: ['#9D8189', '#F4ACB7', '#FFE5D9'],
    votes: 620,
    rank: 5,
    avatar: 'https://i.pravatar.cc/150?u=sari'
  },
];

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getCommunityChallenges() {
  if (!isSupabaseConfigured) {
    return MOCK_LEADERBOARD;
  }
  
  const { data, error } = await supabase!
    .from('challenge_entries')
    .select('*')
    .order('votes', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching challenges:', error);
    return MOCK_LEADERBOARD;
  }

  return data;
}

export async function upvoteChallengeEntry(id: string) {
  if (!isSupabaseConfigured) {
    console.log(`Mock upvote for id ${id}`);
    return true;
  }

  const { error } = await supabase!.rpc('increment_vote', { row_id: id });
  if (error) {
    console.error('Error upvoting:', error);
    return false;
  }
  return true;
}

export async function unvoteChallengeEntry(id: string) {
  if (!isSupabaseConfigured) {
    console.log(`Mock unvote for id ${id}`);
    return true;
  }

  // Attempt decrement via RPC if exists or fallback update
  const { error } = await supabase!.rpc('decrement_vote', { row_id: id });
  if (error) {
    console.warn('Fallback unvote:', error);
  }
  return true;
}

export async function submitCommunityEntry(entry: any) {
  if (!isSupabaseConfigured) {
    console.log('Mock submit entry:', entry);
    return { success: true, data: entry };
  }

  const { data, error } = await supabase!
    .from('challenge_entries')
    .insert([entry]);

  if (error) {
    console.error('Error submitting entry:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function updateChallengeEntry(id: string, updates: { user_name?: string; location?: string; outfit_photo?: string; color_palette?: string[] }) {
  if (!isSupabaseConfigured) {
    console.log(`Mock update entry ${id}:`, updates);
    return { success: true };
  }

  const { data, error } = await supabase!
    .from('challenge_entries')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating entry:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function deleteChallengeEntry(id: string) {
  if (!isSupabaseConfigured) {
    console.log(`Mock delete entry ${id}`);
    return { success: true };
  }

  const { error } = await supabase!
    .from('challenge_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    return { success: false, error };
  }
  return { success: true };
}

import { FASHION_CATALOG_300, FashionCatalogItem } from './fashion-catalog-data';

// ==========================================
// FASHION CATALOG & SEARCH
// ==========================================

export const EMBEDDED_FASHION_CATALOG: FashionCatalogItem[] = FASHION_CATALOG_300;

export async function searchFashionCatalog(filters: { category?: string; skinTone?: string; query?: string; gender?: string; brandTier?: string }) {
  if (isSupabaseConfigured) {
    let query = supabase!.from('fashion_catalog').select('*');
    if (filters.category && filters.category !== 'Semua') query = query.eq('category', filters.category);
    if (filters.brandTier && filters.brandTier !== 'Semua') query = query.eq('brand_tier', filters.brandTier);
    if (filters.gender && filters.gender !== 'Semua') query = query.eq('gender', filters.gender);
    if (filters.query) query = query.ilike('name', `%${filters.query}%`);

    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as FashionCatalogItem[];
  }

  // Fallback to local catalog
  return EMBEDDED_FASHION_CATALOG.filter(item => {
    if (filters.category && filters.category !== 'Semua' && item.category !== filters.category) return false;
    if (filters.brandTier && filters.brandTier !== 'Semua' && item.brandTier !== filters.brandTier) return false;
    if (filters.gender && filters.gender !== 'Semua' && item.gender !== filters.gender && item.gender !== 'unisex') return false;
    if (filters.skinTone && filters.skinTone !== 'Semua' && !item.suitableSkinTones.includes(filters.skinTone as any)) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
                    item.brandName.toLowerCase().includes(q) ||
                    item.material.toLowerCase().includes(q) ||
                    item.colorName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

// ==========================================
// USER & CLOUD WARDROBE
// ==========================================

export async function signInWithGoogle() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) console.error('Error signing in:', error);
    return data;
  }
}

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data: { user } } = await supabase!.auth.getUser();
    return user;
  }
  return { id: 'mock-user' };
}

export async function syncLocalWardrobeToCloud(outfits: any[]) {
  if (!isSupabaseConfigured) return false;
  const user = await getCurrentUser();
  if (!user) return false;

  for (const outfit of outfits) {
    await supabase!.from('outfits').upsert({
      id: outfit.id,
      user_id: user.id,
      photo_url: outfit.image || '',
      description: outfit.title,
      color_palette: outfit.colorPalette,
      notes: outfit.notes || '',
      category: outfit.category || 'Lookbook',
      items: outfit.items || []
    });
  }
  return true;
}

export async function fetchCloudWardrobe() {
  if (!isSupabaseConfigured) return [];
  const user = await getCurrentUser();
  if (!user) return [];
  
  const { data } = await supabase!.from('outfits').select('*').eq('user_id', user.id);
  return data || [];
}

export async function deleteCloudWardrobeItem(id: string) {
  if (!isSupabaseConfigured) return true;
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase!.from('outfits').delete().eq('id', id).eq('user_id', user.id);
  return !error;
}

export async function updateCloudWardrobeItem(id: string, updates: { description?: string; notes?: string; category?: string }) {
  if (!isSupabaseConfigured) return true;
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase!.from('outfits').update(updates).eq('id', id).eq('user_id', user.id);
  return !error;
}

// ==========================================
// NEWSLETTER & WAITLIST SUBSCRIPTIONS
// ==========================================

export async function subscribeNewsletter(email: string) {
  if (!isSupabaseConfigured) {
    console.log('Mock subscribe newsletter:', email);
    return { success: true };
  }

  const { data, error } = await supabase!
    .from('newsletter_subscribers')
    .upsert([{ email: email.trim().toLowerCase(), is_active: true, subscribed_at: new Date().toISOString() }], { onConflict: 'email' });

  if (error) {
    console.error('Error subscribing newsletter to DB:', error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function unsubscribeNewsletter(email: string) {
  if (!isSupabaseConfigured) return { success: true };

  const { error } = await supabase!
    .from('newsletter_subscribers')
    .update({ is_active: false })
    .eq('email', email.trim().toLowerCase());

  return { success: !error };
}

export async function saveWaitlistToDatabase(entry: { email: string; whatsapp?: string; name?: string; favoriteStyle?: string }) {
  if (!isSupabaseConfigured) {
    console.log('Mock save waitlist:', entry);
    return { success: true };
  }

  const { data, error } = await supabase!
    .from('waitlist_subscribers')
    .insert([{
      email: entry.email.trim().toLowerCase(),
      whatsapp: entry.whatsapp?.trim() || null,
      name: entry.name?.trim() || null,
      favorite_style: entry.favoriteStyle || null,
      created_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('Error saving waitlist to DB:', error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function syncLocalCalendarToCloud(calendarData: any) {
  if (!isSupabaseConfigured) return false;
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase!.from('weekly_calendar_plans').upsert({
    user_id: user.id,
    plan_data: calendarData,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  return !error;
}
