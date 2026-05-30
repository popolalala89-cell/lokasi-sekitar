# Product Requirements Document (PRD) — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## 1. Executive Summary

Aplikasi Android berbasis Capacitor untuk crowdsourcing lokasi PKL.
Tiga peran: **Informan** (lapor), **Pedagang** (konsumsi info), **Admin** (verifikasi + moderasi).
Backend: Supabase (PostgreSQL + Auth + Storage).

---

## 2. User Stories

### 2.1 Informan

| ID | Story | Priority |
|----|-------|----------|
| INF-01 | Daftar/login dengan email | P0 |
| INF-02 | Lihat misi (permintaan info dari pedagang) terdekat berdasarkan GPS | P0 |
| INF-03 | Ambil foto + catat GPS lokasi PKL | P0 |
| INF-04 | Kirim laporan ke misi yang aktif | P0 |
| INF-05 | Lihat riwayat laporan + status (pending/verified/ditolak) | P1 |
| INF-06 | Lihat poin terkumpul + riwayat transaksi | P1 |
| INF-07 | Lihat leaderboard informan (gamifikasi) | P2 |

### 2.2 Pedagang

| ID | Story | Priority |
|----|-------|----------|
| PDG-01 | Daftar/login dengan email | P0 |
| PDG-02 | Beli paket (harian/mingguan/bulanan) | P0 |
| PDG-03 | Buat misi: "Cari lokasi ramai di area X" | P0 |
| PDG-04 | Lihat laporan yang masuk ke misi saya | P0 |
| PDG-05 | Beri poin ke informan yang informasinya berguna | P0 |
| PDG-06 | Lihat sisa kuota info dari paket aktif | P1 |
| PDG-07 | Lihat laporan di peta interaktif | P1 |

### 2.3 Admin

| ID | Story | Priority |
|----|-------|----------|
| ADM-01 | Dashboard: total user, misi, laporan, transaksi | P0 |
| ADM-02 | Verifikasi/tolak laporan (foto + GPS check) | P0 |
| ADM-03 | Kelola paket & harga | P1 |
| ADM-04 | Broadcast notifikasi ke semua user | P2 |
| ADM-05 | Export data (CSV) untuk analitik | P2 |

---

## 3. Functional Requirements

### 3.1 Authentication
- Login/Register via email + password (Supabase Auth)
- Session persistence (token disimpan di localStorage)
- Auto-login saat buka aplikasi

### 3.2 Kamera & GPS
- Buka kamera native via Capacitor Camera plugin
- Baca GPS via Capacitor Geolocation plugin
- GPS wajib menyala — tampilkan alert jika mati

### 3.3 Laporan (Submission)
- Field: foto, lat, lng, catatan, mission_id (opsional)
- Status: pending → verified/ditolak oleh admin
- Upload foto ke Supabase Storage → simpan URL publik

### 3.4 Misi (Mission)
- Dibuat oleh pedagang
- Field: judul, area (teks), budget_poin, deadline
- Status: active/closed

### 3.5 Poin & Transaksi
- 1 laporan verified = +10 poin
- Poin bisa dicairkan (coming soon)
- Riwayat transaksi mencatat semua perubahan poin

### 3.6 Peta
- Leaflet.js + OpenStreetMap tiles
- Marker untuk setiap laporan yang verified
- Klik marker → detail laporan

---

## 4. Non-Functional Requirements

| Kategori | Requirement |
|----------|-------------|
| **Performance** | Loading app < 3s, foto upload < 10s |
| **Offline** | Simpan laporan di localStorage saat offline, sync saat online |
| **Security** | Row-Level Security (RLS) di Supabase, HTTPS only |
| **Size** | APK < 15MB |
| **Compatibility** | Android 8.0+ (API 26+) |
| **Accessibility** | Kontras warna 4.5:1, touch target 48x48dp |

---

## 5. User Flow (High-Level)

```
[Login] → [Role-based Dashboard]
  ├── Informan → Cari Misi → Ambil Foto → Kirim Laporan → Lihat Riwayat
  ├── Pedagang  → Beli Paket → Buat Misi → Lihat Laporan → Beri Poin
  └── Admin     → Dashboard → Verifikasi Laporan → Kelola User
```

---

## 6. Release Plan

| Phase | Fitur | Target |
|-------|-------|--------|
| **MVP (v2.0)** | Login, lapor, verifikasi, peta, poin dasar | Saat ini |
| **v2.1** | Misi, paket berbayar, top-up | +2 minggu |
| **v2.2** | Leaderboard, notifikasi push, gamifikasi | +1 bulan |
| **v3.0** | AI auto-verifikasi, multi-kota, referral | +3 bulan |

---

*Dokumen ini HARUS diupdate setelah setiap sprint review.*
