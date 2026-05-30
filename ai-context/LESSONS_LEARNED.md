# LESSONS_LEARNED.md — Pelajaran dari Error, Revisi, & Keputusan Teknis

> **Versi:** 1.0 | **Dibuat:** 31 Mei 2026
>
> **ATURAN WAJIB:** Setiap kali ada pelajaran penting dari error, revisi, atau keputusan teknis,
> AI agent WAJIB mencatatnya di sini. Pelajaran di sini bersifat REUSABLE — bisa dipakai
> untuk mencegah error serupa di masa depan.

---

## Format Wajib

```
### LL-XXX: [Judul Pelajaran]
- **Tanggal:** YYYY-MM-DD
- **Sumber:** Dari error mana? (ERR-XXX) / Dari keputusan mana? (DEC-XXX) / Observasi
- **Pelajaran:** Apa yang dipelajari? (1-3 kalimat)
- **Dampak:** Apa konsekuensinya kalau diabaikan?
- **Aturan Baru (jika ada):** Aturan coding/kerja yang ditambahkan akibat pelajaran ini
- **File Terkait:** path/ke/file
- **Status:** ✅ Diterapkan / 🚧 Dalam Proses
```

---

## Daftar Pelajaran

### LL-001: `loading="lazy"` Merusak Layout di Capacitor WebView Android
- **Tanggal:** v1.3.0 (Mei 2026)
- **Sumber:** Observasi — user report gambar tidak muncul
- **Pelajaran:** Capacitor WebView Android tidak support atribut `loading="lazy"` pada img tag. Gambar tidak muncul atau layout rusak total.
- **Dampak:** Gambar di seluruh aplikasi tidak muncul di Android. User experience rusak.
- **Aturan Baru:** CR-XXX: JANGAN pakai `loading="lazy"` di img tag. Gunakan CSS `.thumb` 50x50. (Tercatat di `engineering/coding_rules.md`)
- **File Terkait:** `www/index.html` — semua img tag
- **Status:** ✅ Diterapkan

---

### LL-002: Tidak Bisa Build APK di Termux
- **Tanggal:** v1.0.0 (Mei 2026)
- **Sumber:** Observasi — gagal setup Android SDK di Termux
- **Pelajaran:** Termux tidak support Android SDK build tools karena perbedaan arsitektur. Satu-satunya cara build APK dari Termux adalah via CI/CD eksternal.
- **Dampak:** Tidak bisa test APK langsung — harus push → tunggu CI → download → install.
- **Aturan Baru:** Semua build APK via GitHub Actions. Debug APK (push main), Release APK (tag v*). (Tercatat di `architecture/architecture.md` DEC-005)
- **File Terkait:** `.github/workflows/android-build.yml`
- **Status:** ✅ Diterapkan

---

### LL-003: Supabase RLS Wajib Di-set Sebelum Tabel Dipakai
- **Tanggal:** v1.1.0 (Mei 2026)
- **Sumber:** ERR-??? — user tidak bisa akses data sendiri
- **Pelajaran:** Tabel baru di Supabase harus langsung diberi RLS policy saat pembuatan. Tanpa RLS, default-nya DENY ALL — tidak ada yang bisa akses.
- **Dampak:** User tidak bisa baca/tulis data. Aplikasi blank.
- **Aturan Baru:** Setiap migrasi SQL HARUS menyertakan `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + minimal 1 policy. (Tercatat di `engineering/security_rules.md` SR-010)
- **File Terkait:** Semua file `supabase/*.sql`
- **Status:** ✅ Diterapkan

---

### LL-004: Foto Base64 Terlalu Besar untuk Upload
- **Tanggal:** v1.2.0 (Mei 2026)
- **Sumber:** ERR-002 — upload gagal
- **Pelajaran:** Kamera HP modern (12MP+) menghasilkan foto > 5MB dalam bentuk base64. Upload via koneksi lambat bisa timeout atau gagal. Perlu resize client-side sebelum upload.
- **Dampak:** Upload gagal → user frustrasi → tidak pakai aplikasi.
- **Aturan Baru:** Resize foto ke max 1024px width sebelum upload. Format JPEG quality 70%. (Tercatat di `engineering/performance_rules.md` PR-010)
- **File Terkait:** `www/index.html` → `submitReport()`
- **Status:** ✅ Diterapkan (disarankan, belum mandatory di kode)

---

### LL-005: GPS Tidak Akurat di Dalam Ruangan
- **Tanggal:** v1.4.0 (Mei 2026)
- **Sumber:** Observasi — user report lokasi tidak akurat
- **Pelajaran:** GPS membutuhkan line-of-sight ke satelit. Di dalam ruangan, akurasi bisa > 50 meter. Perlu indikator akurasi.
- **Dampak:** Laporan lokasi tidak akurat → pedagang salah info → kepercayaan turun.
- **Aturan Baru:** Tampilkan akurasi GPS saat lapor. Warning jika > 50m. (Belum mandatory di kode)
- **File Terkait:** `www/index.html` → `submitReport()`
- **Status:** ✅ Diterapkan (opsional warning, belum mandatory reject)

---

### LL-006: Patch Tool Bisa Double-Escape Backslash
- **Tanggal:** 31 Mei 2026
- **Sumber:** ERR-004
- **Pelajaran:** Saat menggunakan `patch()` tool untuk file yang mengandung string dengan banyak backslash (seperti `\\\\\\'` untuk onclick escaping), tool bisa melakukan double-escaping. Hasilnya string berubah dan kode rusak.
- **Dampak:** Onclick handler rusak, gambar tidak bisa diklik. Sulit dideteksi karena tidak ada syntax error.
- **Aturan Baru:** Setelah menggunakan `patch()`, SELALU verifikasi hasil dengan `search_files` untuk memastikan escaping benar. Bandingkan dengan line serupa di file yang sama.
- **File Terkait:** `www/index.html` — semua onclick handler
- **Status:** ✅ Diterapkan

---

### LL-007: Dokumentasi Fondasi Mencegah Development Chaos
- **Tanggal:** 31 Mei 2026
- **Sumber:** Keputusan Pa Popo
- **Pelajaran:** Tanpa dokumentasi fondasi, setiap AI agent bekerja dengan asumsi berbeda-beda. Akibat: inkonsistensi, duplikasi, dan error yang bisa dicegah. Dokumentasi adalah investasi satu kali yang menghemat puluhan jam debugging.
- **Dampak:** Tanpa dokumentasi: agent ubah schema tanpa update docs, agent pakai nama tabel berbeda, agent tidak tahu aturan bisnis.
- **Aturan Baru:** Agent WAJIB baca `AGENTS.md` + 5 file sebelum mulai kerja. Setiap perubahan harus diikuti update dokumentasi.
- **File Terkait:** Semua file di `docs/`, `architecture/`, `engineering/`, `ai-context/`
- **Status:** ✅ Diterapkan

---

## Template Entry Baru

```markdown
### LL-XXX: [Judul]
- **Tanggal:** YYYY-MM-DD
- **Sumber:** ERR-XXX / DEC-XXX / Observasi
- **Pelajaran:** 
- **Dampak:** 
- **Aturan Baru (jika ada):** 
- **File Terkait:** 
- **Status:** ⬜ Proposed / 🚧 Dalam Proses / ✅ Diterapkan
```

---

*Jangan hapus entry lama. Pelajaran tetap berlaku sampai ada yang menggantikan.*
