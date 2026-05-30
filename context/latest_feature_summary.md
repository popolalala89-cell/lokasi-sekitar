# Latest Feature Summary — Lokasi Sekitar

> **Auto-generated:** 31 Mei 2026 | **Source:** `CURRENT_STATE.md` + code review
>
> ⚠️ RINGKASAN fitur yang sudah jadi, sedang dikerjakan, dan direncanakan.
> Update setiap kali fitur selesai.

---

## Fitur Jadi (✅ Production)

### 1. Authentication System
- **File:** `www/index.html` → Auth section
- **Deskripsi:** Login/Register dengan email + password via Supabase Auth
- **Role:** Saat register pilih `informan` atau `pedagang`
- **Session:** Auto-login (token di localStorage)
- **Logout:** Clear session + redirect ke login

### 2. Role-Based Dashboard
- **File:** `www/index.html` → showDashboard()
- **Deskripsi:** Tampilan berbeda untuk Admin, Informan, Pedagang
- **Admin:** Dashboard statistik + list laporan pending + list user
- **Informan:** Form lapor + riwayat laporan + poin
- **Pedagang:** Peta + (misi coming soon)

### 3. Informan: Lapor Lokasi
- **File:** `www/index.html` → submitReport()
- **Flow:** Buka kamera → Ambil foto → Baca GPS → Catatan → Upload
- **Validasi:** GPS di Indonesia, foto tidak kosong
- **Storage:** Foto di Supabase Storage, metadata di tabel submissions
- **Status awal:** pending

### 4. Admin: Verifikasi Laporan
- **File:** `www/index.html` → verifyReport() / rejectReport()
- **Flow:** Lihat foto → Cek GPS → Klik Verifikasi/Tolak
- **Efek:** Verified → trigger +10 poin ke informan
- **Bulk:** Belum ada (coming soon)

### 5. Peta Interaktif
- **File:** `www/index.html` → initMap() / loadMarkers()
- **Library:** Leaflet.js + OpenStreetMap tiles
- **Marker:** Laporan verified dengan popup (thumb+caption)
- **Offset:** GPS di-random 50-200m (privasi)

### 6. Poin System
- **File:** Supabase trigger + `www/index.html`
- **Mekanisme:** Trigger PostgreSQL `award_points_on_verify`
- **Amount:** +10 poin per laporan verified
- **Audit:** Tercatat di tabel transactions

### 7. CI/CD Build APK
- **File:** `.github/workflows/android-build.yml`
- **Trigger:** Push main → debug APK | Tag v* → release APK (signed)
- **Artifacts:** Download dari GitHub Actions tab

---

## Fitur Setengah Jadi (⚠️ Partial)

### 8. Offline Queue
- **Status:** Basic — simpan di localStorage, sync saat online
- **Batasan:** Maks 5 laporan, belum ada progress indicator

---

## Fitur Rencana Jangka Pendek (v2.1)

1. **Misi (Mission) System** — Pedagang buat permintaan info
2. **Paket & Payment** — Paket harian/mingguan/bulanan, top-up
3. **Notifikasi** — Supabase Realtime untuk status update

---

## Fitur Rencana Jangka Panjang (v2.2 - v3.0)

1. **Leaderboard** — Gamifikasi informan
2. **AI Auto-Verifikasi** — Cek validitas foto + GPS otomatis
3. **Multi-Kota** — Filter & grouping per kota
4. **Export CSV** — Download data untuk analitik

---

## Total Fitur

| Status | Count |
|--------|-------|
| ✅ Production | 7 |
| ⚠️ Partial | 1 |
| 🚧 In Progress | 0 |
| ❌ Planned | 8 |

---

*Update setelah setiap fitur selesai.*
