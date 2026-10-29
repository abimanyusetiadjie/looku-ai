-- ====================================================================
-- SUPABASE STORAGE BUCKET SETUP: 'products'
-- Run this in your Supabase SQL Editor to enable public storage for images
-- ====================================================================

-- 1. Create the 'products' public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public read access to view images in 'products' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access for products bucket'
  ) THEN
    CREATE POLICY "Public Access for products bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');
  END IF;
END $$;

-- 3. Allow uploads to 'products' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow uploads to products bucket'
  ) THEN
    CREATE POLICY "Allow uploads to products bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'products');
  END IF;
END $$;
