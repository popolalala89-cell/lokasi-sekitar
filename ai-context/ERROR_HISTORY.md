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

### ERR-005: Leaderboard Gagal Load — Join Syntax Tidak Kompatibel
- **Tanggal:** 31 Mei 2026
- **Gejala:** Halaman leaderboard kosong atau toast "Gagal load leaderboard". Tidak ada data yang muncul.
- **Reproduksi:** Buka Leaderboard dari dashboard Informan atau Pedagang.
- **Root Cause:** Query menggunakan `profiles!inner(nama)` join syntax yang tidak kompatibel dengan Supabase JS v2.39.0. Join hint `!inner` membutuhkan versi lebih baru atau format berbeda. Akibat: query error dan handler menampilkan toast.
- **File Terdampak:** `www/index.html` → `loadLeaderboard()` (line 1188)
- **Solusi:** Ganti join query dengan dua query terpisah: (1) select user_id dari lokasi, (2) batch query profiles untuk nama. Lebih reliable dan kompatibel dengan semua versi Supabase JS.
- **Status:** ✅ Fixed

---

### ERR-006: Kirim Laporan Misi Gagal — Tabel Missions Belum Ada
- **Tanggal:** 31 Mei 2026
- **Gejala:** Form lapor tidak bisa dibuka atau dropdown misi error. Laporan gagal terkirim jika user memilih misi.
- **Reproduksi:** Buka form Lapor → dropdown misi kosong/error → submit dengan misi terpilih (jika ada cache).
- **Root Cause:** Tabel `missions` belum di-migrate di Supabase. Query `loadMisiDropdown()` gagal (catch block kosong — silent failure). `loadHistori()` juga gagal karena join `missions(title)` ke tabel yang tidak ada. Jika user entah bagaimana punya mission_id tersimpan, insert ke kolom `mission_id` yang belum ada akan gagal.
- **File Terdampak:** `www/index.html` → `loadMisiDropdown()`, `loadHistori()`, `submitReport()`
- **Solusi:** 
  1. `loadMisiDropdown()`: tampilkan "⚠️ Fitur misi belum tersedia" sebagai fallback, bukan silent failure
  2. `loadHistori()`: hapus join ke tabel missions, tampilkan mission_id sebagai teks saja
  3. `submitReport()`: sudah aman karena `misiId` falsy (string kosong) jika dropdown gagal load
- **Status:** ✅ Fixed

---

### ERR-007: Google OAuth — Redirect WebView Diblokir Google
- **Tanggal:** 1 Juni 2026
- **Gejala:** Tap "Masuk dengan Google" → "localhost menolak terhubung" (ERR_CONNECTION_REFUSED)
- **Reproduksi:** `signInWithOAuth` dgn `redirectTo: window.location.origin` → WebView redirect ke Google → redirect balik ke `https://localhost` gagal
- **Root Cause:** Google memblokir OAuth di embedded WebView. Capacitor WebView = embedded.
- **File Terdampak:** `www/index.html` → `handleGoogleLogin()`
- **Solusi:** Ganti ke Chrome Custom Tabs (`Browser.open _blank`) + deep link `com.cibay.lokasisekitar://auth/callback`
- **Status:** 🚧 In Progress (redirect balik app berhasil, token belum terproses)

### ERR-008: GoogleAuth Plugin Native Tidak Terdeteksi
- **Tanggal:** 1 Juni 2026
- **Gejala:** "Google Sign-In native tidak tersedia"
- **Reproduksi:** Plugin `@codetrix-studio/capacitor-google-auth` ada di node_modules tapi `Capacitor.Plugins.GoogleAuth` undefined
- **Root Cause:** Plugin ES module butuh bundler (webpack/vite). App vanilla `<script>` tidak bisa import ES module. `registerPlugin()` tidak terpanggil.
- **File Terdampak:** `www/index.html` → `initGoogleAuth()`, `handleGoogleLogin()`
- **Solusi:** Tidak pakai plugin native. Pindah ke Chrome Custom Tabs OAuth flow.
- **Status:** ✅ Closed (workaround)

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
