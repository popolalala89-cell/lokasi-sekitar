# ERROR_HISTORY.md — Catatan Bug & Error

> **Versi:** 1.0 | **Dibuat:** 31 Mei 2026
>
> **ATURAN WAJIB:** Setiap kali terjadi error/bug, AI agent WAJIB mencatatnya di sini.
> SEBELUM memperbaiki error, baca file ini untuk cek apakah error pernah terjadi sebelumnya.

---

## Format Wajib

Setiap entry HARUS mengikuti format di bawah. Jangan skip field apa pun.

```
### ERR-XXX: [Judul Singkat Error]
- **Tanggal:** YYYY-MM-DD
- **Gejala:** Apa yang terlihat/dialami user?
- **Reproduksi:** Langkah-langkah untuk memunculkan error
- **Root Cause:** Penyebab utama (teknis)
- **File Terdampak:** path/ke/file
- **Solusi:** Apa yang dilakukan untuk memperbaiki
- **Status:** ✅ Fixed / 🚧 In Progress / ⬜ Known (belum difix)
```

---

## Daftar Error

### ERR-001: Double Submit Laporan
- **Tanggal:** v1.1.2 (Mei 2026)
- **Gejala:** Laporan PKL terkirim 2x di database. User lihat 2 laporan identik.
- **Reproduksi:** Tap tombol "Kirim" 2x dengan cepat sebelum request pertama selesai.
- **Root Cause:** Tidak ada disable button / submit guard setelah tap pertama. User bisa tap berkali-kali.
- **File Terdampak:** `www/index.html` → `submitReport()`
- **Solusi:** Tambah variabel `isSubmitting` flag. Disable tombol di awal fungsi, enable di `finally`. Termasuk di error path.
- **Status:** ✅ Fixed (v1.1.2, diperkuat di v2.0.1)

---

### ERR-002: Session Expired saat Upload Foto Besar
- **Tanggal:** v1.3.1 (Mei 2026)
- **Gejala:** Upload foto gagal dengan error "JWT expired". User harus login ulang.
- **Reproduksi:** Login → ambil foto ukuran besar (4000x3000px) → upload via internet lambat → session 1 jam habis.
- **Root Cause:** Supabase Auth JWT expired 1 jam. Upload foto besar via koneksi lambat bisa > 1 menit. Token expired sebelum upload selesai.
- **File Terdampak:** `www/index.html` → `submitReport()`
- **Solusi:** Supabase JS client auto-refresh token sebelum expired. Pastikan client version ≥ 2.39.0.
- **Status:** ✅ Fixed (v1.3.1)

---

### ERR-003: Peta Leaflet Blank di HP Xiaomi
- **Tanggal:** v1.4.2 (Mei 2026)
- **Gejala:** Peta tidak muncul di beberapa HP Xiaomi (Redmi Note series). Hanya background abu-abu.
- **Reproduksi:** Buka tab Peta di HP Xiaomi Redmi Note 8/9/10.
- **Root Cause:** WebView di HP Xiaomi tidak support WebGL renderer Leaflet.
- **File Terdampak:** `www/index.html` → `initMap()`
- **Solusi:** Leaflet default renderer adalah SVG (bukan WebGL). Pastikan tidak ada opsi `preferCanvas: true`. Tile menggunakan PNG mode.
- **Status:** ✅ Fixed (v1.4.2)

---

### ERR-004: Onclick Escaping Double-Escaped oleh Patch Tool
- **Tanggal:** 31 Mei 2026
- **Gejala:** Saat klik thumbnail foto, URL tidak terbuka / error di console.
- **Reproduksi:** Patch file index.html via `patch()` tool → string `\\\\\\'` berubah jadi `\\\\\\\\\\\\'` (double-escaped).
- **Root Cause:** Tool `patch()` melakukan escape processing yang tidak konsisten dengan string yang mengandung banyak backslash.
- **File Terdampak:** `www/index.html` → line 711 (saat itu)
- **Solusi:** Manual fix dengan patch spesifik ke line yang salah. Verifikasi dengan `search_files` untuk cek konsistensi escaping.
- **Status:** ✅ Fixed

---

## Template Entry Baru

```markdown
### ERR-XXX: [Judul]
- **Tanggal:** YYYY-MM-DD
- **Gejala:** 
- **Reproduksi:** 
- **Root Cause:** 
- **File Terdampak:** 
- **Solusi:** 
- **Status:** ⬜ Known / 🚧 In Progress / ✅ Fixed
```

---

*Jangan hapus entry lama. Entry adalah historical record.*
*Gunakan nomor ERR berurutan (ERR-005, ERR-006, ...).*
