# Latest Schema Summary — Lokasi Sekitar

> **Updated:** 31 Mei 2026 | **Source:** Supabase Dashboard + SQL migrations

---

## Active Tables (v2.0)

### `profiles` — User profiles
id(UUID PK), email, nama, role(admin|informan|pedagang), poin(INT), avatar_url, created_at, updated_at

### `lokasi` — Laporan PKL
id(SERIAL PK), user_id(FK), kategori_id(FK), **mission_id(FK NULL)** ← new v2.1, nama_pedagang, latitude, longitude, deskripsi, foto_url(TEXT[]), status(pending|diverifikasi|ditolak), created_at, updated_at

### `kategori` — 7 kategori default
### `produk` — Dagangan pedagang
### `laporan` — Log verifikasi admin

---

## New Tables (v2.1) ✅

### `missions` — Misi dari pedagang
id(SERIAL PK), vendor_id(FK→auth.users), title, area, budget_poin(CHECK>=10), deadline, status(active|closed), created_at, updated_at

**RLS:** Read active (all), CRUD own (vendor), Admin all.
**Trigger:** `auto_close_missions()` — auto-close saat deadline.
**Trigger:** `award_mission_points()` — +15 poin untuk laporan ke misi aktif.

### `packages` — Paket berbayar
id(SERIAL PK), user_id(FK→auth.users), type(daily|weekly|monthly), price, quota_total, quota_used(DEFAULT 0), status(active|expired|cancelled), purchased_at, expires_at

**RLS:** Read own, Insert (pedagang), Admin all.
**Trigger:** `use_package_quota()` — auto-kurangi quota saat laporan masuk ke misi.
**Function:** `has_active_package(uid)` — cek paket aktif.
**Function:** `auto_expire_packages()` — auto-expire.

---

## Storage
| Bucket | Purpose |
|--------|---------|
| `pkl-photos` | Foto laporan (public read, auth upload) |

## RPC
| Function | Args | Purpose |
|----------|------|---------|
| `increment_poin` | uid, amount | Tambah poin user |

---

*Last migration: 31 Mei 2026 — v2.1 schema (missions + packages)*
