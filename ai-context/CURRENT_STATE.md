# CURRENT_STATE.md — Kondisi Project Saat Ini

> **Versi:** 2.2.1 | **Terakhir diupdate:** 1 Juni 2026

---

## Status Umum

| Item | Status |
|------|--------|
| **Versi aplikasi** | 2.2.1 (gamification + bugfix) |
| **Stabilitas** | Stable |
| **Fase development** | Fase 2 — Fitur v2.1 & v2.2 selesai |
| **Next milestone** | v2.3 — Google Login OAuth / AI Auto-Verifikasi |
| **Blocker** | Tidak ada |

---

## Ringkasan Fase 2 (v2.1 — Misi & Paket)

### v2.1 — Misi & Paket ✅
1. ✅ Tabel `missions` — vendor_id, title, area, budget_poin, deadline, status
2. ✅ Tabel `packages` — type (daily/weekly/monthly), price, quota, status
3. ✅ UI Pedagang: Buat Misi (`misiPg`, `buatMisiPg`)
4. ✅ UI Informan: Cari Misi Terdekat (`cariMisiPg`)
5. ✅ Kolom `mission_id` di tabel `lokasi` (FK)
6. ✅ Load misi dropdown di form lapor

### v2.2 — Gamifikasi & Notifikasi ✅
1. ✅ Leaderboard informan (`leaderPg`) — bulanan, semua waktu
2. ✅ Badge/achievement system — tier bronze/silver/gold
3. ✅ Halaman Profil (`profilPg`) — statistik, badge, poin
4. ✅ Notifikasi real-time via Supabase Realtime
5. ✅ Toast notification system menggantikan `alert()`

### Bug Fixes
1. ✅ ERR-005: Leaderboard gagal load — join query incompatible (31 Mei 2026)
2. ✅ ERR-006: Laporan misi error — fallback handling (31 Mei 2026)
3. ✅ v1.6.3-1.6.4: Blank putih setelah login — role-to-page mapping (30-31 Mei 2026)

### Process Improvement
1. ✅ DEC-008: Completion Gate — wajib update 7 docs sebelum task selesai (1 Juni 2026)

---

## Fitur yang Sudah Jalan (✅)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Login/Register email | ✅ | Supabase Auth + auto-create profile |
| Role-based dashboard | ✅ | Admin, Informan, Pedagang |
| Informan: Lapor (foto+GPS) | ✅ | Upload ke pkl-photos bucket |
| Admin: Verifikasi/Tolak | ✅ | +10 poin via trigger |
| Admin: Dashboard statistik | ✅ | Count queries pending/verified/total |
| Peta interaktif | ✅ | Leaflet + GPS offset privasi |
| Poin otomatis | ✅ | DB trigger award_points_on_verify |
| Pedagang: Laporan sekitar | ✅ | List verified + beri poin |
| Pedagang: Kelola produk | ✅ | CRUD produk |
| Pedagang: Buat Misi | ✅ | Budget poin, deadline, auto-close |
| Informan: Cari & Ikut Misi | ✅ | Misi terdekat, claim |
| Leaderboard | ✅ | Bulanan & all-time, tier badge |
| Profil + Badge | ✅ | Statistik, bronze/silver/gold |
| Notifikasi realtime | ✅ | Supabase Realtime |
| CI/CD build APK | ✅ | Debug (push) + Release (tag) |
| Completion Gate | ✅ | AGENTS.md section + DEC-008 |

---

## Fitur yang Belum Ada (❌)

| Fitur | Priority | Target Version |
|-------|----------|----------------|
| Google Login OAuth | P1 | v2.3 |
| Payment integration (QRIS) | P1 | v2.3 |
| AI auto-verifikasi | P2 | v3.0 |
| Multi-kota support | P2 | v3.0 |
| Export CSV | P2 | v3.0 |

---

## File Terbaru

| File | Baris | Deskripsi |
|------|-------|-----------|
| `www/index.html` | 1.367 | Main app — 47+ fungsi |
| `ai-context/AGENTS.md` | ~200 | Aturan AI agent + Completion Gate |
| `ai-context/CURRENT_STATE.md` | ini | Status terkini |
| `ai-context/DECISIONS.md` | 158 | 8 keputusan teknis (DEC-001 s/d DEC-008) |
| `ai-context/ERROR_HISTORY.md` | 115 | 6 error tercatat (ERR-001 s/d ERR-006) |
| `ai-context/TASK_BOARD.md` | 85 | Board task (perlu update) |

---

*Update setelah setiap task selesai.*
