-- ========================================
-- LOKASI SEKITAR - Database Setup
-- ========================================

-- 1. USER PROFILES (extend Supabase auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  nama TEXT,
  role TEXT CHECK (role IN ('admin', 'informan', 'pedagang')) DEFAULT 'informan',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. KATEGORI PKL
CREATE TABLE IF NOT EXISTS public.kategori (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  icon TEXT DEFAULT '📍',
  warna TEXT DEFAULT '#FF6B35',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOKASI PKL (dilaporkan informan)
CREATE TABLE IF NOT EXISTS public.lokasi (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  kategori_id INT REFERENCES public.kategori(id),
  nama_pedagang TEXT,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT[],
  status TEXT CHECK (status IN ('pending', 'diverifikasi', 'ditolak')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUK PEDAGANG (pedagang bisa daftarin produk)
CREATE TABLE IF NOT EXISTS public.produk (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  lokasi_id INT REFERENCES public.lokasi(id),
  nama_produk TEXT NOT NULL,
  harga TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LAPORAN (verifikasi admin)
CREATE TABLE IF NOT EXISTS public.laporan (
  id SERIAL PRIMARY KEY,
  lokasi_id INT REFERENCES public.lokasi(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tipe TEXT CHECK (tipe IN ('verifikasi', 'tutup', 'palsu')) DEFAULT 'verifikasi',
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INSERT KATEGORI DEFAULT
INSERT INTO public.kategori (nama, icon) VALUES
  ('Makanan', '🍜'),
  ('Minuman', '🧋'),
  ('Sayur/Buah', '🥬'),
  ('Pakaian', '👗'),
  ('Aksesoris', '💍'),
  ('Elektronik', '📱'),
  ('Lainnya', '📍')
ON CONFLICT DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ========================================

-- Profiles: user bisa baca semua, edit sendiri
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca semua profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Edit profile sendiri" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insert profile sendiri" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Kategori: semua bisa baca, admin bisa edit
ALTER TABLE public.kategori ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca semua kategori" ON public.kategori FOR SELECT USING (true);
CREATE POLICY "Admin edit kategori" ON public.kategori FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Lokasi: semua bisa baca, user bisa CRUD sendiri, admin bisa semua
ALTER TABLE public.lokasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca semua lokasi" ON public.lokasi FOR SELECT USING (true);
CREATE POLICY "Insert lokasi sendiri" ON public.lokasi FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update lokasi sendiri" ON public.lokasi FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete lokasi sendiri" ON public.lokasi FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admin kelola semua lokasi" ON public.lokasi FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Produk: semua bisa baca, pedagang CRUD sendiri
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca semua produk" ON public.produk FOR SELECT USING (true);
CREATE POLICY "CRUD produk sendiri" ON public.produk FOR ALL USING (auth.uid() = user_id);

-- Laporan: user bisa baca+bikin laporan sendiri, admin CRUD semua
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca laporan sendiri" ON public.laporan FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Insert laporan sendiri" ON public.laporan FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin kelola semua laporan" ON public.laporan FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ========================================
-- TRIGGER: Auto-create profile on signup
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'informan');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- VIEW: Dashboard Admin (gabungan data)
-- ========================================
CREATE OR REPLACE VIEW public.admin_dashboard AS
SELECT
  (SELECT COUNT(*) FROM public.lokasi) AS total_lokasi,
  (SELECT COUNT(*) FROM public.lokasi WHERE status = 'pending') AS lokasi_pending,
  (SELECT COUNT(*) FROM public.lokasi WHERE status = 'diverifikasi') AS lokasi_terverifikasi,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'informan') AS total_informan,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'pedagang') AS total_pedagang,
  (SELECT COUNT(*) FROM public.laporan WHERE tipe = 'verifikasi') AS laporan_pending,
  (SELECT COUNT(*) FROM public.laporan WHERE created_at > NOW() - INTERVAL '7 days') AS laporan_minggu_ini;
