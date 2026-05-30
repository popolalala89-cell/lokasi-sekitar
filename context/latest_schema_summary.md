# Latest Schema Summary — Lokasi Sekitar

> **Auto-generated:** 31 Mei 2026 | **Source:** Supabase Dashboard + `supabase-setup.sql`
>
> ⚠️ RINGKASAN. Untuk detail lengkap, lihat `engineering/database_schema.md`.

---

## Active Tables

### `profiles` — User profiles (extends Supabase Auth)
id(UUID PK), email, nama, role(admin|informan|pedagang), poin(INT DEFAULT 0), avatar_url, created_at, updated_at

### `lokasi` — Laporan PKL dari informan
id(SERIAL PK), user_id(FK), kategori_id(FK), nama_pedagang, latitude(DECIMAL), longitude(DECIMAL), deskripsi, foto_url(TEXT[]), status(pending|diverifikasi|ditolak), created_at, updated_at

### `kategori` — Kategori dagangan PKL
id(SERIAL PK), nama, icon, warna. (7 row default: Makanan, Minuman, Sayur, Pakaian, Aksesoris, Elektronik, Lainnya)

### `produk` — Dagangan pedagang
id(SERIAL PK), user_id(FK), lokasi_id(FK NULL), nama_produk, harga, foto_url, created_at

### `laporan` — Log verifikasi
id(SERIAL PK), lokasi_id(FK), user_id(FK), tipe(verifikasi|tutup|palsu), keterangan, created_at

---

## Storage

| Bucket | Purpose |
|--------|---------|
| `pkl-photos` | Foto laporan (public read, auth upload) |

---

## RPC Functions

| Function | Args | Purpose |
|----------|------|---------|
| `increment_poin` | uid UUID, amount INT | Tambah poin user |

---

## Triggers

| Trigger | Table | Purpose |
|---------|-------|---------|
| `on_auth_user_created` | auth.users | Auto-create profiles row |
| `handle_new_user` | — | Set role='informan', copy email |

---

## PLANNED (v2.1)

- `missions` — Misi dari pedagang
- `packages` — Paket berbayar
- RPC untuk auto-close misi expired
- Trigger award poin (gantikan client-side increment_poin)

---

*Update setelah migrasi database.*
