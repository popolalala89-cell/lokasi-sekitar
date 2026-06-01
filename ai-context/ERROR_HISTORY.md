# ERROR_HISTORY.md — Catatan Bug & Error

> **Versi:** 2.0 | **Update:** 1 Juni 2026

---

## Daftar Error

### ERR-001: Double Submit Laporan
- **Tanggal:** v1.1.2 (Mei 2026)
- **Status:** ✅ Fixed

### ERR-002: Session Expired saat Upload Foto Besar
- **Tanggal:** v1.3.1 (Mei 2026)
- **Status:** ✅ Fixed

### ERR-003: Peta Leaflet Blank di HP Xiaomi
- **Tanggal:** v1.4.2 (Mei 2026)
- **Status:** ✅ Fixed

### ERR-004: Onclick Escaping Double-Escaped oleh Patch Tool
- **Tanggal:** 31 Mei 2026
- **Status:** ✅ Fixed

### ERR-005: Leaderboard Gagal Load — Join Syntax Tidak Kompatibel
- **Tanggal:** 31 Mei 2026
- **Status:** ✅ Fixed

### ERR-006: Kirim Laporan Misi Gagal — Tabel Missions Belum Ada
- **Tanggal:** 31 Mei 2026
- **Status:** ✅ Fixed

### ERR-007: Google OAuth — Redirect WebView Diblokir Google
- **Tanggal:** 1 Juni 2026
- **Gejala:** Tap "Masuk dengan Google" → "localhost menolak terhubung" (ERR_CONNECTION_REFUSED)
- **Root Cause:** Google memblokir OAuth di embedded WebView. Capacitor WebView = embedded.
- **Solusi:** Ganti ke Chrome Custom Tabs (`Browser.open _blank`) + deep link callback
- **Status:** 🚧 In Progress

### ERR-008: GoogleAuth Plugin Native Tidak Terdeteksi
- **Tanggal:** 1 Juni 2026
- **Gejala:** "Google Sign-In native tidak tersedia"
- **Root Cause:** Plugin ES module, app vanilla HTML tanpa bundler. `registerPlugin()` tidak terpanggil.
- **Solusi:** Tidak pakai plugin native. Pindah ke Chrome Custom Tabs.
- **Status:** ✅ Closed (workaround)

### ERR-009: capacitor.plugins.json Kosong — Plugin Capacitor Tidak Terdaftar
- **Tanggal:** 1 Juni 2026
- **Gejala:** `Capacitor.Plugins.App` undefined, `appUrlOpen` tidak menyala, deep link callback tidak dipanggil
- **Root Cause:** `capacitor.plugins.json` = `[]` karena `cap sync` tidak di-commit setelah plugin diinstall. Capacitor bridge baca file ini untuk registrasi plugin.
- **Solusi:** `npx cap sync android` → commit hasil sync
- **Status:** ✅ Fixed (v2.3.18)

---

*Gunakan nomor ERR berurutan.*
