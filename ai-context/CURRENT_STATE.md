# CURRENT_STATE.md — Kondisi Project Saat Ini

> **Versi:** 2.0.1 | **Terakhir diupdate:** 31 Mei 2026

---

## Status Umum

| Item | Status |
|------|--------|
| **Versi aplikasi** | 2.0.1 (maintenance release) |
| **Stabilitas** | Stable |
| **Fase development** | Fase 1 — Maintenance (selesai 9/10 task) |
| **Next milestone** | v2.1 — Misi & Paket |
| **Blocker** | Tidak ada |

---

## Ringkasan Fase 1 (Maintenance)

### Yang sudah dikerjakan (31 Mei 2026):

1. ✅ **Code review** — `www/index.html` vs coding rules
2. ✅ **Plugin install** — `@capacitor/camera@^5`, `@capacitor/geolocation@^5`, `@capacitor/filesystem@^5`, `@capacitor/splash-screen@^5`
3. ✅ **Refactor** — Comment header JSDoc untuk semua fungsi, struktur modul jelas (Auth, Navigation, Admin, Informan, Pedagang, Map, Utility)
4. ✅ **escapeHtml()** — 15 pemakaian, semua render user input aman dari XSS
5. ✅ **Offline awareness** — `isOnline()` check sebelum submit, toast warning
6. ✅ **Error standardization** — Semua error via `showToast()` (34 pemakaian), ada success/error/warning/info
7. ✅ **showToast()** — Custom toast notification menggantikan `alert()` (1 alert tersisa: prompt user input)
8. ✅ **loading="lazy"** — Dihapus dari `www/app.js` (file dead code dihapus total)
9. ✅ **GPS offset** — `offsetGPS()` random 50-200m untuk marker peta (BR-070)
10. ⬜ **Build release APK** — Commit + tag v2.0.1 + push

### File berubah:
- `www/index.html` — Refactor penuh (284→808 baris, documented, safer)
- `www/app.js` — DIHAPUS (dead code, tidak direferensi)
- `package.json` — 4 plugin Capacitor baru
- `engineering/database_schema.md` — Update ke actual schema
- `engineering/api_contract.md` — Update table names
- `context/latest_schema_summary.md` — Update

---

## Fitur yang Sudah Jalan (✅)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Login/Register email | ✅ | Supabase Auth + auto-create profile |
| Role-based dashboard | ✅ | Admin, Informan, Pedagang |
| Informan: Lapor (foto+GPS) | ✅ | Upload ke pkl-photos bucket |
| Admin: Verifikasi/Tolak | ✅ | +10 poin via RPC increment_poin |
| Admin: Dashboard statistik | ✅ | Count queries |
| Admin: List laporan | ✅ | Filter by status |
| Peta interaktif | ✅ | Leaflet + GPS offset privasi |
| Poin otomatis | ✅ | RPC increment_poin |
| Pedagang: Laporan sekitar | ✅ | List verified |
| Pedagang: Beri poin | ✅ | Via prompt dialog |
| Pedagang: Kelola produk | ✅ | CRUD produk |
| CI/CD build APK | ✅ | Debug (push) + Release (tag) |

---

## Fitur yang Belum Ada (❌)

| Fitur | Priority | Target Version |
|-------|----------|----------------|
| Misi | P0 | v2.1 |
| Paket berbayar | P0 | v2.1 |
| Notifikasi real-time | P1 | v2.2 |
| Leaderboard | P2 | v2.2 |
| AI auto-verifikasi | P2 | v3.0 |

---

*Update setelah setiap task selesai.*
