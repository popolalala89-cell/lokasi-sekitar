# CHANGELOG.md — Riwayat Perubahan

> **Format:** [Versi] — Tanggal | Jenis | Deskripsi
> **Jenis:** `feat` (fitur baru), `fix` (perbaikan), `docs` (dokumentasi), `refactor` (rapikan kode)

---

## v2.2.1 — 1 Juni 2026

### fix
- **Leaderboard gagal load (ERR-005):** Ganti join query dengan dua query terpisah — batch query profiles untuk nama. Kompatibel dengan Supabase JS v2.39.0.
- **Kirim laporan misi error (ERR-006):** loadMisiDropdown() tampilkan fallback message, loadHistori() hapus join ke missions, submitReport() aman karena misiId falsy jika dropdown gagal.

### docs
- **Completion Gate:** Tambah section di AGENTS.md — wajib update 7 docs sebelum task selesai.
- **DEC-008:** Keputusan teknis tentang Completion Gate.
- **CURRENT_STATE.md:** Update ke v2.2.1.
- **TASK_BOARD.md:** Mark v2.1 & v2.2 task selesai.
- **CHANGELOG.md:** File ini — dibuat pertama kali.

---

## v2.2.0 — 31 Mei 2026

### feat
- **Leaderboard:** Halaman leaderboard informan — bulanan & all-time. Tier badge (bronze/silver/gold).
- **Profil:** Halaman profil user — statistik laporan, poin, badge.
- **Notifikasi realtime:** Supabase Realtime untuk update status laporan.
- **Toast notification:** Custom toast menggantikan `alert()` — 34 pemakaian, 4 tipe (success/error/warning/info).

---

## v2.1.0 — 31 Mei 2026

### feat
- **Misi:** Pedagang bisa buat misi (budget poin, deadline). Informan bisa cari & ikut misi terdekat.
- **Paket:** Pedagang bisa beli paket (daily/weekly/monthly) — kuota laporan.
- **Tabel missions & packages:** Dibuat di Supabase.
- **Kolom mission_id:** Ditambahkan ke tabel lokasi (FK ke missions).
- **Auto-close missions:** Trigger saat deadline lewat.
- **Mission points:** +15 poin (bukan +10) jika laporan terkait misi.

---

## v2.0.1 — 31 Mei 2026

### refactor
- **Code review:** index.html direfactor — JSDoc headers, struktur modul, escapeHtml(), offline awareness.
- **Error standardization:** Semua error via showToast(), 34 pemakaian.
- **Plugin Capacitor:** @capacitor/camera@^5, geolocation@^5, filesystem@^5, splash-screen@^5.

### docs
- **Dokumentasi fondasi:** 30 file di 5 folder (docs/, architecture/, engineering/, ai-context/, context/).
- **AGENTS.md:** Aturan AI agent + alur kerja.

### fix
- **ERR-001:** Double submit (submit guard).
- **ERR-002:** Session expired upload foto besar (auto-refresh token).
- **ERR-003:** Peta blank di Xiaomi (SVG renderer).
- **ERR-004:** Onclick double-escaped oleh patch tool.

---

## v1.6.x — 30-31 Mei 2026

### fix
- **v1.6.4:** Fix blank-after-login — check page exists BEFORE hiding, pageForRole() safety mapping.
- **v1.6.3:** Fix blank page — restore CSS .pg{display:none}, remove JS hiding loop.
- **v1.6.2:** Remove .pg display:none CSS, use JS init to hide pages.
- **v1.6.1:** Add try-catch debug to showPg.
- **v1.6.0:** Rebuild from v1.3.3 base — inline style display toggle.

---

## v1.5.x — 30 Mei 2026

### fix
- **v1.5.5:** Remove loading="lazy" (breaks Capacitor WebView).
- **v1.5.4:** Remove debug alerts, add loading=lazy (safe, then removed).
- **v1.5.2:** Step-by-step login debug alerts.

### feat
- **v1.5.0:** Initial Capacitor wrapper — login, register, lapor, peta, admin.

---

## v1.0 — v1.4 — Mei 2026

### feat (early versions)
- Login/Register email via Supabase Auth
- Role-based dashboard (Admin, Informan, Pedagang)
- Lapor PKL (foto + GPS)
- Admin verifikasi/tolak
- Peta Leaflet + OpenStreetMap
- Poin system (DB trigger)
- CI/CD GitHub Actions (debug + release APK)

---

*Update setiap kali commit dengan perubahan signifikan.*
