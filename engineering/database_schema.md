# Database Schema — Lokasi Sekitar

> **Versi:** 1.1 | **Terakhir diupdate:** 31 Mei 2026
>
> **Source of Truth:** File ini SELALU harus sinkron dengan SQL di folder `supabase/`.
> Setiap perubahan schema HARUS di-migrate (update SQL → update file ini).

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│ profiles │       │    lokasi    │       │   laporan    │
│          │1    * │              │1    * │              │
│ id (PK)  ├──────→│ user_id (FK) ├──────→│ lokasi_id(FK)│
│ email    │       │ kategori_id  │       │ user_id (FK) │
│ nama     │       │ latitude     │       │ tipe         │
│ role     │       │ longitude    │       │ keterangan   │
│ poin     │       │ deskripsi    │       └──────────────┘
│ ...      │       │ foto_url[]   │
└────┬─────┘       │ status       │
     │             │ created_at   │
     │             └──────┬───────┘
     │                    │
     │              ┌─────▼─────┐
     │              │  produk   │
     │              │ user_id   │
     │              │ lokasi_id │
     │              │ nama      │
     │              │ harga     │
     │              └───────────┘
     │
     │1      ┌──────────────┐
     └──────→│  (missions)  │ PLANNED v2.1
             │  (packages)  │ PLANNED v2.1
             └──────────────┘
```

---

## Table: `profiles`

Extends Supabase Auth. Auto-created via trigger on signup.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK→auth.users | ID dari Supabase Auth |
| `email` | TEXT | NULL | Email user |
| `nama` | TEXT | NULL | Nama lengkap |
| `role` | TEXT | CHECK ('admin','informan','pedagang'), DEFAULT 'informan' | Peran |
| `poin` | INTEGER | DEFAULT 0 | Saldo poin |
| `avatar_url` | TEXT | NULL | Foto profil |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | — |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | — |

**RLS:** Read all (authenticated), Update self, Admin all.

---

## Table: `lokasi`

Data laporan PKL dari informan. Dulu disebut "submissions" di dokumentasi perencanaan.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PK | Auto-increment |
| `user_id` | UUID | FK→auth.users, NOT NULL | Informan |
| `kategori_id` | INT | FK→kategori.id | Kategori dagangan |
| `nama_pedagang` | TEXT | NULL | Nama pedagang (opsional) |
| `latitude` | DECIMAL(10,7) | NOT NULL | Latitude GPS |
| `longitude` | DECIMAL(10,7) | NOT NULL | Longitude GPS |
| `deskripsi` | TEXT | NULL | Deskripsi/catatan |
| `foto_url` | TEXT[] | NULL | Array URL foto |
| `status` | TEXT | CHECK ('pending','diverifikasi','ditolak'), DEFAULT 'pending' | Status |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | — |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | — |

**RLS:** Read all, Insert own, Update own, Admin all.

---

## Table: `kategori`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PK | — |
| `nama` | TEXT | NOT NULL | Nama kategori |
| `icon` | TEXT | DEFAULT '📍' | Emoji |
| `warna` | TEXT | DEFAULT '#FF6B35' | Warna |

**Default data:** Makanan, Minuman, Sayur/Buah, Pakaian, Aksesoris, Elektronik, Lainnya.

---

## Table: `produk`

Dagangan pedagang.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PK | — |
| `user_id` | UUID | FK→auth.users, NOT NULL | Pedagang |
| `lokasi_id` | INT | FK→lokasi.id, NULL | Lokasi terkait |
| `nama_produk` | TEXT | NOT NULL | Nama produk |
| `harga` | TEXT | NULL | Harga (teks) |
| `foto_url` | TEXT | NULL | Foto produk |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | — |

---

## Table: `laporan`

Log verifikasi (admin action).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PK | — |
| `lokasi_id` | INT | FK→lokasi.id, NOT NULL | Laporan terkait |
| `user_id` | UUID | FK→auth.users, NOT NULL | Admin yang verifikasi |
| `tipe` | TEXT | CHECK ('verifikasi','tutup','palsu') | Tipe laporan |
| `keterangan` | TEXT | NULL | Catatan |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | — |

---

## Trigger: `handle_new_user()`

Auto-create profile saat signup.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'informan');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## RPC: `increment_poin(uid, amount)`

Stored procedure untuk menambah poin user. Dipanggil dari client via `db.rpc()`.

```sql
-- (ada di Supabase, definisi exact TBD)
```

---

## PLANNED Tables (v2.1)

### `missions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | — |
| `vendor_id` | UUID FK | Pedagang |
| `title` | TEXT | Judul misi |
| `area` | TEXT | Area yang diminta |
| `budget_poin` | INTEGER | Budget total |
| `deadline` | TIMESTAMPTZ | Deadline |
| `status` | CHECK ('active','closed') | Status |

### `packages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | — |
| `user_id` | UUID FK | Pedagang |
| `type` | CHECK | daily/weekly/monthly |
| `price` | INTEGER | Harga |
| `quota_total` | INTEGER | Total kuota |
| `quota_used` | INTEGER | Kuota terpakai |
| `expires_at` | TIMESTAMPTZ | Expired |

---

## Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `pkl-photos` | Authenticated upload | Foto laporan PKL |

---

*Update schema ini setelah setiap migration. Sync dengan file SQL di supabase/.*
