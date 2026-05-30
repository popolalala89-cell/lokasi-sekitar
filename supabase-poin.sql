-- Tambah kolom poin (kalau belum ada)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS poin INT DEFAULT 0;

-- Function untuk tambah poin (dipanggil via RPC)
CREATE OR REPLACE FUNCTION public.increment_poin(uid UUID, amount INT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET poin = COALESCE(poin, 0) + amount
  WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
