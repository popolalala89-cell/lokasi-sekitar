# Glossary — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> Definisi istilah yang digunakan di seluruh project. Gunakan istilah baku ini di kode, database, dan dokumentasi.

---

## A-D

| Istilah | Definisi | Nama di Kode/DB |
|---------|----------|-----------------|
| **Admin** | Pengguna dengan akses penuh — verifikasi, kelola user, dashboard | `role = 'admin'` |
| **APK** | File instalasi Android (.apk) hasil build Capacitor | `lokasi-sekitar-release.apk` |
| **Capacitor** | Framework hybrid — bungkus web app jadi APK Android | `@capacitor/core` |
| **CI/CD** | Continuous Integration / Deployment — GitHub Actions | `.github/workflows/` |
| **Dashboard** | Halaman utama setelah login, berbeda per role | `showDashboard()` |

---

## E-K

| Istilah | Definisi | Nama di Kode/DB |
|---------|----------|-----------------|
| **Email Auth** | Login/register menggunakan email + password via Supabase Auth | `supabase.auth.signInWithPassword()` |
| **GPS** | Koordinat latitude/longitude dari device | `getCurrentPosition()` |
| **Informan** | User yang melaporkan lokasi PKL — dapat poin per laporan | `role = 'informan'` |
| **Keystore** | File kriptografi untuk sign APK release | `lokasi-sekitar-release.keystore` |

---

## L-P

| Istilah | Definisi | Nama di Kode/DB |
|---------|----------|-----------------|
| **Laporan** | Data yang dikirim informan: foto + GPS + catatan | `submissions` table |
| **Leaflet.js** | Library peta OpenStreetMap | `leaflet.js` |
| **Misi** | Permintaan info lokasi dari pedagang ke informan | `missions` table |
| **OpenStreetMap** | Peta gratis alternatif Google Maps | `tile.openstreetmap.org` |
| **Paket** | Kuota info yang dibeli pedagang | `packages` table |
| **Pedagang** | User yang membuat misi dan membeli akses info — kadang disebut PKL | `role = 'pedagang'` |
| **Poin** | Reward virtual untuk informan — bisa dicairkan | `points` / `balance` |

---

## Q-T

| Istilah | Definisi | Nama di Kode/DB |
|---------|----------|-----------------|
| **RLS** | Row-Level Security — aturan akses data per user di Supabase | Supabase SQL policy |
| **Role** | Peran user: `admin`, `informan`, `pedagang` | `users.role` |
| **Session** | State login user yang aktif (token JWT) | `supabase.auth.getSession()` |
| **Submission** | Istilah teknis untuk "laporan" | `submissions` table |
| **Supabase** | Backend-as-a-Service — PostgreSQL + Auth + Storage | `@supabase/supabase-js` |
| **Termux** | Terminal emulator + Linux environment di Android | Build environment |

---

## U-Z

| Istilah | Definisi | Nama di Kode/DB |
|---------|----------|-----------------|
| **Verified** | Status laporan yang sudah dicek dan disetujui admin | `status = 'verified'` |
| **Web App** | Aplikasi HTML+JS yang jadi basis sebelum dibungkus Capacitor | `www/index.html` |

---

## Aturan Penamaan

1. **Database:** snake_case (`user_id`, `mission_id`, `created_at`)
2. **JavaScript:** camelCase (`getUserRole`, `submitReport`, `loadMap`)
3. **File HTML:** lowercase dengan dash (`index.html`, `admin-dashboard.html` — sejauh ini single file)
4. **Git branch:** `feature/nama-fitur`, `fix/nama-bug`, `docs/nama-dokumen`

---

*Tambahkan istilah baru di sini SEBELUM digunakan di kode.*
