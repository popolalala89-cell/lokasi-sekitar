-- ========================================
-- LOKASI SEKITAR v2.1 — Packages Table
-- ========================================
-- Run via Supabase SQL Editor

-- 1. TABLE: packages
CREATE TABLE IF NOT EXISTS public.packages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT CHECK (type IN ('daily', 'weekly', 'monthly')) NOT NULL,
  price INTEGER NOT NULL,
  quota_total INTEGER NOT NULL,
  quota_used INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 2. RLS: Packages
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Pedagang lihat paket sendiri
CREATE POLICY "Read own packages" ON public.packages
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Pedagang beli paket
CREATE POLICY "Buy package" ON public.packages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'pedagang'
    )
  );

-- Admin lihat & kelola semua paket
CREATE POLICY "Admin manage packages" ON public.packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. FUNCTION: validasi paket aktif sebelum buat misi
CREATE OR REPLACE FUNCTION public.has_active_package(uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  pkg RECORD;
BEGIN
  SELECT * INTO pkg FROM public.packages
  WHERE user_id = uid
    AND status = 'active'
    AND expires_at > NOW()
    AND quota_used < quota_total
  ORDER BY expires_at DESC
  LIMIT 1;
  
  RETURN pkg IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNCTION: auto-expire packages
CREATE OR REPLACE FUNCTION public.auto_expire_packages()
RETURNS void AS $$
BEGIN
  UPDATE public.packages
  SET status = 'expired'
  WHERE status = 'active' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. INDEX untuk lookup cepat
CREATE INDEX IF NOT EXISTS idx_missions_status ON public.missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_vendor ON public.missions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_packages_user ON public.packages(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_lokasi_mission ON public.lokasi(mission_id);

-- 6. TRIGGER: kurangi quota saat laporan masuk ke misi
CREATE OR REPLACE FUNCTION public.use_package_quota()
RETURNS TRIGGER AS $$
DECLARE
  pkg RECORD;
BEGIN
  -- Hanya proses jika laporan punya mission_id
  IF NEW.mission_id IS NOT NULL THEN
    -- Cari paket aktif vendor (pemilik misi)
    SELECT * INTO pkg FROM public.packages
    WHERE user_id = (SELECT vendor_id FROM public.missions WHERE id = NEW.mission_id)
      AND status = 'active'
      AND expires_at > NOW()
      AND quota_used < quota_total
    ORDER BY expires_at DESC
    LIMIT 1;
    
    -- Kurangi quota
    IF pkg IS NOT NULL THEN
      UPDATE public.packages
      SET quota_used = quota_used + 1
      WHERE id = pkg.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_use_package_quota ON public.lokasi;
CREATE TRIGGER tr_use_package_quota
  AFTER INSERT ON public.lokasi
  FOR EACH ROW EXECUTE FUNCTION public.use_package_quota();
