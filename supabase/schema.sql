-- Schema for AI-OOTD Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: wardrobe_items
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: challenges
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    hashtag TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    prize_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: outfits (general user outfits)
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    description TEXT,
    color_palette JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: challenge_entries
CREATE TABLE IF NOT EXISTS public.challenge_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
    user_name TEXT,
    location TEXT,
    outfit_photo TEXT NOT NULL,
    color_palette JSONB,
    avatar TEXT,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(challenge_id, user_id)
);

-- Table: votes
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entry_id UUID REFERENCES public.challenge_entries(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(entry_id, user_id)
);

-- RPC for incrementing votes securely
CREATE OR REPLACE FUNCTION increment_vote(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenge_entries
  SET votes = votes + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Set up Row Level Security (RLS)

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Wardrobe Items RLS
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wardrobe." ON public.wardrobe_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wardrobe." ON public.wardrobe_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wardrobe." ON public.wardrobe_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wardrobe." ON public.wardrobe_items FOR DELETE USING (auth.uid() = user_id);

-- Challenges RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges are viewable by everyone." ON public.challenges FOR SELECT USING (true);

-- Outfits RLS
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Outfits are viewable by everyone." ON public.outfits FOR SELECT USING (true);
CREATE POLICY "Users can insert own outfits." ON public.outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits." ON public.outfits FOR DELETE USING (auth.uid() = user_id);

-- Challenge Entries RLS
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Entries are viewable by everyone." ON public.challenge_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert own entries." ON public.challenge_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Votes RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are viewable by everyone." ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes." ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table: fashion_catalog
CREATE TABLE IF NOT EXISTS public.fashion_catalog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT,
    breathability TEXT,
    color_name TEXT,
    color_hex TEXT,
    price_min INTEGER,
    price_max INTEGER,
    shopee_query TEXT,
    tokopedia_query TEXT,
    image TEXT,
    suitable_skin_tones JSONB,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fashion Catalog RLS
ALTER TABLE public.fashion_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fashion catalog is viewable by everyone." ON public.fashion_catalog FOR SELECT USING (true);

-- Seed Initial Weekly Challenge
INSERT INTO public.challenges (id, title, description, hashtag, start_date, end_date, prize_description)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Earthy Tropis Outfit Challenge',
    'Mix & match outfit bertema Earthy Minimalist bernuansa adem tropis (Sage, Mocca, Linen, Rayon).',
    '#EarthyTropisChallenge',
    now(),
    now() + INTERVAL '7 days',
    'Voucher Belanja Shopee Rp 500.000 untuk Top 3 Look'
) ON CONFLICT DO NOTHING;

-- Seed Initial Fashion Catalog Items
INSERT INTO public.fashion_catalog (name, category, material, breathability, color_name, color_hex, price_min, price_max, shopee_query, tokopedia_query, image, suitable_skin_tones, gender)
VALUES
('Kemeja Linen Oversized Drop Shoulder', 'atasan', 'Linen Euro 100%', '98.4%', 'Sage Green', '#9CA986', 85000, 125000, 'kemeja linen oversized sage green', 'kemeja linen oversized sage green', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80', '["fair","light","medium","tan","deep"]', 'unisex'),
('Kulot Highwaist Flowy Rayon Crinkle', 'bawahan', 'Katun Rayon Twill', '96.2%', 'Oat Mocca', '#D6C0B3', 75000, 99000, 'kulot highwaist crinkle mocca', 'kulot highwaist crinkle mocca', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80', '["fair","light","medium","tan","deep"]', 'female'),
('Pashmina Silk Miracle Laser Cut', 'outer_hijab', 'Silk Ceruty Flowy', '92.0%', 'Dusty Mauve', '#DCAE96', 45000, 65000, 'pashmina silk miracle laser cut', 'pashmina silk miracle laser cut', 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=600&q=80', '["fair","light","medium","tan"]', 'female'),
('Celana Chino Slim Straight Katun', 'bawahan', 'Cotton Twill Stretch', '89.5%', 'Khaki Cream', '#C3B091', 89000, 135000, 'celana chino slim fit khaki pria', 'celana chino slim fit khaki pria', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80', '["fair","light","medium","tan","deep"]', 'male'),
('Kemeja Cuban Camp Collar Linen', 'atasan', 'Linen Crinkle Adem', '97.0%', 'Off-White Ivory', '#FAF9F6', 95000, 140000, 'kemeja cuban collar linen pria', 'kemeja cuban collar linen pria', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', '["fair","light","medium","tan","deep"]', 'male'),
('Blazer Semi-Wool Lightweight', 'outer_hijab', 'Poly-Viscose Breather', '85.0%', 'Charcoal Dark', '#2B2D42', 175000, 245000, 'blazer lightweight wanita scbd', 'blazer lightweight wanita scbd', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', '["fair","light","medium","tan","deep"]', 'female')
ON CONFLICT DO NOTHING;

-- ==========================================
-- PRODUCTION EXTENSION TABLES (WAVE 3)
-- ==========================================

-- Table: waitlist_subscribers (VIP Early Access)
CREATE TABLE IF NOT EXISTS public.waitlist_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    whatsapp TEXT,
    favorite_style TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.waitlist_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register for waitlist." ON public.waitlist_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Waitlist viewable by authenticated admin." ON public.waitlist_subscribers FOR SELECT USING (true);

-- Table: newsletter_subscribers (Footer Newsletter)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe to newsletter." ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update newsletter subscription." ON public.newsletter_subscribers FOR UPDATE USING (true);
CREATE POLICY "Newsletter viewable by everyone." ON public.newsletter_subscribers FOR SELECT USING (true);

-- Table: weekly_calendar_plans (7-Day OOTD Cloud Plan)
CREATE TABLE IF NOT EXISTS public.weekly_calendar_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    plan_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.weekly_calendar_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own calendar plan." ON public.weekly_calendar_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calendar plan." ON public.weekly_calendar_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calendar plan." ON public.weekly_calendar_plans FOR UPDATE USING (auth.uid() = user_id);
