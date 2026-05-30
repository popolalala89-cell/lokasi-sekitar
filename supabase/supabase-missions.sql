-- ========================================
-- LOKASI SEKITAR v2.1 — Missions Table
-- ========================================
-- Run via Supabase SQL Editor

-- 1. TABLE: missions
CREATE TABLE IF NOT EXISTS public.missions (
  id SERIAL PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  budget_poin INTEGER NOT NULL CHECK (budget_poin >= 10),
  deadline TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADD mission_id to lokasi (optional FK)
ALTER TABLE public.lokasi ADD COLUMN IF NOT EXISTS mission_id INT REFERENCES public.missions(id);

-- 3. RLS: Missions
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Semua logged-in user bisa lihat misi aktif
CREATE POLICY "Read active missions" ON public.missions
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND status = 'active'
  );

-- Pedagang bisa lihat misi sendiri (semua status)
CREATE POLICY "Read own missions" ON public.missions
  FOR SELECT USING (
    auth.uid() = vendor_id
  );

-- Pedagang bisa buat misi (harus punya paket aktif)
CREATE POLICY "Create mission" ON public.missions
  FOR INSERT WITH CHECK (
    auth.uid() = vendor_id
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'pedagang'
    )
  );

-- Pemilik misi bisa update (close)
CREATE POLICY "Update own mission" ON public.missions
  FOR UPDATE USING (
    auth.uid() = vendor_id
  );

-- Admin bisa semua
CREATE POLICY "Admin manage missions" ON public.missions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. FUNCTION: auto-close expired missions
CREATE OR REPLACE FUNCTION public.auto_close_missions()
RETURNS void AS $$
BEGIN
  UPDATE public.missions
  SET status = 'closed', updated_at = NOW()
  WHERE status = 'active' AND deadline < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGER: award poin saat laporan diverifikasi (jika terkait misi)
CREATE OR REPLACE FUNCTION public.award_mission_points()
RETURNS TRIGGER AS $$
DECLARE
  mission_record RECORD;
BEGIN
  -- Hanya proses jika laporan terkait misi dan status berubah ke diverifikasi
  IF NEW.status = 'diverifikasi' AND OLD.status = 'pending' AND NEW.mission_id IS NOT NULL THEN
    -- Ambil info misi
    SELECT * INTO mission_record FROM public.missions WHERE id = NEW.mission_id;
    
    -- Beri 15 poin (bukan 10) jika laporan terkait misi aktif
    IF mission_record.status = 'active' THEN
      PERFORM public.increment_poin(NEW.user_id, 15);
    ELSE
      PERFORM public.increment_poin(NEW.user_id, 10);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_award_mission_points ON public.lokasi;
CREATE TRIGGER tr_award_mission_points
  BEFORE UPDATE ON public.lokasi
  FOR EACH ROW EXECUTE FUNCTION public.award_mission_points();
