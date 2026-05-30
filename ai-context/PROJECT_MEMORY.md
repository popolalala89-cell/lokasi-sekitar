# PROJECT_MEMORY.md — Sejarah & Pelajaran Project

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **Tujuan:** Menyimpan pelajaran berharga, bug yang pernah terjadi, dan konteks historis
> yang tidak tercatat di git commit messages.

---

## Timeline Project

| Tanggal | Milestone | Detail |
|---------|-----------|--------|
| 29 Mei 2026 | Ide awal | Plan dibuat sebagai Telegram Mini App |
| 30 Mei 2026 | Pivot ke Capacitor | Beralih dari TMA ke Capacitor Android APK |
| 30 Mei 2026 | v1.0 - v1.5.5 | Iterasi cepat — fitur dasar bekerja |
| 31 Mei 2026 | v2.0 | Refactor + dokumentasi fondasi |
| 31 Mei 2026 | Dokumentasi fondasi | Dibuat struktur docs/, architecture/, engineering/, ai-context/ |

---

## Pelajaran Berharga (Lessons Learned)

### LL-001: `loading="lazy"` Merusak Layout di Capacitor WebView
- **Masalah:** Gambar tidak muncul atau layout rusak di Android
- **Root cause:** Capacitor WebView Android tidak support `loading="lazy"` dengan baik
- **Solusi:** JANGAN pakai `loading="lazy"`. Gunakan CSS `.thumb` 50x50 sebagai gantinya.
- **Tanggal:** ~v1.3.0

### LL-002: Gak Bisa Build APK di Termux
- **Masalah:** Termux tidak support Android SDK build tools karena arsitektur berbeda
- **Root cause:** Gradle + Android SDK butuh environment yang tidak tersedia di Termux
- **Solusi:** Build via GitHub Actions CI/CD. Push → Actions build → download APK.
- **Tanggal:** v1.0.0

### LL-003: Supabase RLS Terlalu Ketat
- **Masalah:** User tidak bisa lihat data sendiri setelah register
- **Root cause:** RLS policy belum dibuat untuk tabel users
- **Solusi:** Tambah policy: user bisa SELECT row sendiri, admin SELECT semua
- **Tanggal:** v1.1.0

### LL-004: Foto Base64 Terlalu Besar
- **Masalah:** Upload foto gagal karena base64 string > 5MB
- **Root cause:** Kamera HP modern menghasilkan foto 4000x3000 px
- **Solusi:** Resize client-side ke max 1024px width sebelum upload
- **Tanggal:** v1.2.0

### LL-005: GPS Akurasi Rendah di Indoor
- **Masalah:** GPS tidak akurat saat user di dalam ruangan
- **Root cause:** GPS butuh line-of-sight ke satelit
- **Solusi:** Tampilkan akurasi GPS (meter), warning jika > 50m
- **Tanggal:** v1.4.0

---

## Bug yang Pernah Terjadi (dan Fix-nya)

### BUG-001: Double Submit Laporan
- **Symptom:** Laporan terkirim 2x
- **Root cause:** User tap tombol submit 2x sebelum request selesai
- **Fix:** Disable tombol setelah tap pertama, enable lagi setelah response
- **Tanggal fix:** v1.1.2

### BUG-002: Session Expired Tengah-Tengah Upload
- **Symptom:** Upload foto gagal dengan error "JWT expired"
- **Root cause:** Session 1 jam, upload foto besar bisa > 1 menit → token expired
- **Fix:** Refresh token sebelum upload besar (Supabase auto-refresh)
- **Tanggal fix:** v1.3.1

### BUG-003: Peta Blank di HP Tertentu
- **Symptom:** Peta Leaflet tidak muncul di beberapa HP Xiaomi
- **Root cause:** WebView tidak support WebGL di HP tertentu
- **Fix:** Fallback ke tile PNG (bukan WebGL renderer)
- **Tanggal fix:** v1.4.2

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

---

*Update file ini setiap kali ada pelajaran baru atau bug signifikan.*
