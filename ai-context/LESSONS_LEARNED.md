# LESSONS_LEARNED.md — Pelajaran dari Error, Revisi, & Keputusan Teknis

> **Versi:** 2.0 | **Dibuat:** 31 Mei 2026 | **Update:** 1 Juni 2026

---

## Daftar Pelajaran

### LL-001: `loading="lazy"` Merusak Layout di Capacitor WebView Android
- **Tanggal:** v1.3.0 (Mei 2026)
- **Sumber:** Observasi
- **Pelajaran:** Capacitor WebView Android tidak support `loading="lazy"` di img tag
- **Dampak:** Gambar tidak muncul, layout rusak
- **Aturan Baru:** JANGAN pakai `loading="lazy"`. Gunakan CSS `.thumb` 50x50.
- **Status:** ✅ Diterapkan

### LL-002: Tidak Bisa Build APK di Termux
- **Tanggal:** v1.0.0
- **Sumber:** Observasi
- **Pelajaran:** Termux tidak support Android SDK. Harus CI/CD eksternal.
- **Aturan Baru:** Build APK via GitHub Actions
- **Status:** ✅ Diterapkan

### LL-003: Supabase RLS Wajib Di-set Sebelum Tabel Dipakai
- **Tanggal:** v1.1.0
- **Pelajaran:** Tanpa RLS = DENY ALL. Tabel baru harus langsung ada RLS policy.
- **Status:** ✅ Diterapkan

### LL-004: Foto Base64 Terlalu Besar untuk Upload
- **Tanggal:** v1.2.0
- **Pelajaran:** Kamera 12MP+ > 5MB base64. Perlu resize client-side.
- **Status:** ✅ Diterapkan

### LL-005: GPS Tidak Akurat di Dalam Ruangan
- **Tanggal:** v1.4.0
- **Pelajaran:** GPS butuh line-of-sight. Dalam ruangan > 50m error.
- **Aturan Baru:** Tampilkan akurasi GPS, warning jika > 50m.
- **Status:** ✅ Diterapkan

### LL-006: Patch Tool Bisa Double-Escape Backslash
- **Tanggal:** 31 Mei 2026
- **Sumber:** ERR-004
- **Pelajaran:** `patch()` tool bisa double-escape string dgn banyak backslash.
- **Aturan Baru:** Verifikasi escaping setelah `patch()`
- **Status:** ✅ Diterapkan

### LL-007: Dokumentasi Fondasi Mencegah Development Chaos
- **Tanggal:** 31 Mei 2026
- **Sumber:** Keputusan Pa Popo
- **Pelajaran:** Tanpa dokumentasi = inkonsistensi antar AI agent
- **Aturan Baru:** Agent WAJIB baca AGENTS.md + 5 file. Setiap perubahan update dokumentasi.
- **Status:** ✅ Diterapkan

### LL-008: Google Blokir OAuth di WebView Android
- **Tanggal:** 1 Juni 2026
- **Sumber:** ERR-007
- **Pelajaran:** Google memblokir semua OAuth di embedded WebView (redirect, GIS One Tap). Harus pakai Chrome Custom Tabs.
- **Dampak:** `ERR_CONNECTION_REFUSED` atau "403 disallowed_useragent"
- **Aturan Baru:** OAuth di Capacitor HARUS lewat `Browser.open({ windowName: '_blank' })`
- **Status:** ✅ Diterapkan

### LL-009: Plugin Capacitor ES Module ≠ Vanilla HTML
- **Tanggal:** 1 Juni 2026
- **Sumber:** ERR-008
- **Pelajaran:** Plugin Capacitor community (ES module) butuh bundler. App vanilla `<script>` tidak bisa pakai.
- **Dampak:** `Capacitor.Plugins.NamaPlugin` undefined walau plugin terpasang
- **Aturan Baru:** Sebelum install plugin community, cek apakah perlu bundler
- **Status:** ✅ Diterapkan

### LL-010: Flow OAuth Capacitor = Chrome Custom Tabs + Deep Link
- **Tanggal:** 1 Juni 2026
- **Sumber:** ERR-007
- **Pelajaran:** Tiga syarat wajib OAuth Capacitor: (1) `skipBrowserRedirect: true`, (2) `Browser.open _blank`, (3) intent filter deep link di AndroidManifest
- **Aturan Baru:** Jangan pernah OAuth di WebView Capacitor. Selalu Chrome Custom Tabs.
- **Status:** ✅ Diterapkan

---

*Jangan hapus entry lama. Pelajaran tetap berlaku sampai ada yang menggantikan.*
