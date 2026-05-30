-- ========================================
-- LOKASI SEKITAR v2.2 — Realtime Setup
-- ========================================
-- Run via Supabase SQL Editor

-- Enable Realtime untuk tabel lokasi (notifikasi status update)
ALTER PUBLICATION supabase_realtime ADD TABLE public.lokasi;

-- Enable Realtime untuk tabel missions (notifikasi misi baru)
ALTER PUBLICATION supabase_realtime ADD TABLE public.missions;

-- Verify
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
