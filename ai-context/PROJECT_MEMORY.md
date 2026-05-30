# PROJECT_MEMORY.md — Sejarah & Konteks Historis

> **Versi:** 2.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **Tujuan:** Menyimpan timeline project, milestone, dan konvensi yang terbentuk.
> Untuk bug & error, lihat `ERROR_HISTORY.md`. Untuk pelajaran teknis, lihat `LESSONS_LEARNED.md`.

---

## Timeline Project

| Tanggal | Milestone | Detail |
|---------|-----------|--------|
| 29 Mei 2026 | Ide awal | Plan dibuat sebagai Telegram Mini App |
| 30 Mei 2026 | Pivot ke Capacitor | Beralih dari TMA ke Capacitor Android APK |
| 30 Mei 2026 | v1.0 - v1.5.5 | Iterasi cepat — fitur dasar bekerja |
| 31 Mei 2026 | v2.0 | Refactor + dokumentasi fondasi (28 file) |
| 31 Mei 2026 | v2.0.1 | Maintenance: security hardening (Fase 1 — 10 task) |
| 31 Mei 2026 | v2.1.0 | Misi & Paket: core crowdsourcing (Fase 2 — 19 task) |
| 31 Mei 2026 | v2.2.0 | Gamifikasi: leaderboard, profil, badge, realtime (Fase 3 — 8 task) |

---

## Keputusan yang Sudah Kadaluarsa

| Keputusan | Kenapa Diganti | Pengganti |
|-----------|---------------|-----------|
| Telegram Mini App (plan awal) | User ingin APK standalone | Capacitor Android APK |
| React Native (dipertimbangkan) | Terlalu kompleks, perlu Mac | Capacitor (web-based) |
| Firebase (dipertimbangkan) | Ingin PostgreSQL open-source | Supabase |

---

## Konvensi yang Terbentuk

1. **Pa Popo dipanggil "Pa"** — di Telegram/chat. Di dokumen tetap "Pa Popo".
2. **Bahasa Indonesia** untuk semua komunikasi user-facing
3. **Commit message bahasa Indonesia**
4. **Prioritas: mobile, offline-tolerant, ringan, simpel**
5. **Gak boleh ada framework JS** — keep vanilla
6. **Semua user input di-escape** — wajib `escapeHtml()` sebelum innerHTML
7. **Notifikasi pakai `showToast()`** — tidak boleh `alert()`
8. **GPS di-offset 50-200m** — privasi PKL di peta

---

## Referensi ke File Lain

- **Bug & Error:** `ai-context/ERROR_HISTORY.md` — riwayat error + solusi
- **Pelajaran Teknis:** `ai-context/LESSONS_LEARNED.md` — pelajaran dari error & keputusan
- **Keputusan Aktif:** `ai-context/DECISIONS.md` — log keputusan teknis
- **Dokumentasi Fondasi:** Folder `docs/`, `architecture/`, `engineering/`

---

*Update file ini setiap ada milestone baru atau konvensi baru.*
