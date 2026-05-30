-- ========================================
-- LOKASI SEKITAR - Storage Setup
-- ========================================

-- 1. Create storage bucket for PKL photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pkl-photos',
  'pkl-photos',
  TRUE,                    -- public: bisa diakses siapa aja
  5242880,                 -- max 5MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policy: Siapapun bisa lihat foto (public bucket)
CREATE POLICY "Public read photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pkl-photos');

-- 3. RLS Policy: User authenticated bisa upload
CREATE POLICY "Authenticated upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pkl-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. RLS Policy: User bisa hapus fotonya sendiri
CREATE POLICY "User delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pkl-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. RLS Policy: Admin bisa hapus semua
CREATE POLICY "Admin delete any photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pkl-photos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
