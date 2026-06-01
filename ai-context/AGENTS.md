# AGENTS.md — Wajib Dibaca oleh Setiap AI Agent

> **Versi:** 2.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **PERHATIAN:** Kamu adalah AI agent yang bekerja di project **Lokasi Sekitar**.
> BACA SELURUH file ini SEBELUM menulis atau mengubah kode apa pun.
> File ini adalah **kontrak kerja** antara human (Pa Popo) dan AI agent (kamu).

---

## 🚨 ATURAN PERTAMA & TERPENTING

### 1. JANGAN MULAI CODING SEBELUM BACA DOKUMENTASI

Setiap kali kamu menerima tugas, baca dokumen berikut **dengan urutan ini:**
1. `ai-context/CURRENT_STATE.md` — kondisi project saat ini
2. `ai-context/PROJECT_MEMORY.md` — sejarah & konteks historis
3. `ai-context/ERROR_HISTORY.md` — error yang pernah terjadi (cegah repetisi)
4. `ai-context/LESSONS_LEARNED.md` — pelajaran dari error & keputusan
5. `ai-context/TASK_BOARD.md` — apa yang sedang dikerjakan
6. `ai-context/DECISIONS.md` — keputusan teknis yang sudah dibuat
7. `engineering/coding_rules.md` — aturan coding

### 2. JANGAN UBAH ARSITEKTUR TANPA PERSETUJUAN

- Jangan tambah dependency npm baru tanpa tanya dulu
- Jangan split file `www/index.html` tanpa persetujuan eksplisit
- Jangan ubah struktur folder tanpa update `engineering/folder_structure.md`
- Jangan ubah database schema tanpa migration SQL + update docs
- Setiap keputusan teknis HARUS dicatat di `ai-context/DECISIONS.md`

### 3. JANGAN HAPUS KODE EXISTING

- Project ini sudah berjalan (v2.2). Kode yang ada sudah bekerja.
- Kalau mau refactor, pastikan behavior tidak berubah.
- Kalau mau hapus, pastikan tidak ada yang pakai.

### 4. JANGAN UBAH ARSITEKTUR KARENA ERROR

- Error adalah masalah lokal, bukan alasan untuk ganti arsitektur.
- Jangan langsung mengganti struktur folder, database schema, atau pola coding hanya karena ada error.
- Jika solusi error MEMBUTUHKAN perubahan besar, catat dulu di `ai-context/DECISIONS.md` dengan alasan lengkap sebelum mengubah apa pun.

### 5. WAJIB CATAT ERROR DI ERROR_HISTORY.md

Setiap kali terjadi error/bug, kamu WAJIB mencatatnya di `ai-context/ERROR_HISTORY.md` dengan format:
- Tanggal
- Gejala error
- Langkah reproduksi
- Root cause
- File terdampak
- Solusi yang diterapkan
- Status (✅ Fixed / 🚧 In Progress / ⬜ Known)

### 6. WAJIB CATAT PELAJARAN DI LESSONS_LEARNED.md

Setiap kali ada pelajaran penting dari error (lihat ERR-XXX), revisi, atau keputusan teknis (lihat DEC-XXX), kamu WAJIB mencatatnya di `ai-context/LESSONS_LEARNED.md` dengan format:
- Tanggal
- Sumber (ERR-XXX / DEC-XXX / Observasi)
- Pelajaran
- Dampak jika diabaikan
- Aturan baru yang ditambahkan (jika ada)
- Status

---

## 📋 Alur Kerja Agent (Diperbarui v2.0)

### Sebelum Mengerjakan Tugas
1. Baca 7 file wajib (lihat aturan #1 di atas)
2. Baca file yang akan diubah (pakai `read_file`)
3. Baca aturan terkait di `engineering/` dan `docs/business_rules.md`
4. Cek `ERROR_HISTORY.md` — apakah error serupa pernah terjadi?
5. Cek `LESSONS_LEARNED.md` — apakah ada pelajaran relevan?
6. Konfirmasi pemahaman ke user jika ambigu

### Saat Mengerjakan Tugas
1. Tulis kode sesuai `engineering/coding_rules.md`
2. Jangan break fitur yang sudah ada
3. Jika menemui error, catat di `ERROR_HISTORY.md`
4. Jika solusi butuh perubahan besar, catat alasan di `DECISIONS.md` dulu

### Setelah Mengerjakan Tugas
1. Update `CURRENT_STATE.md`
2. Update `TASK_BOARD.md` (mark selesai)
3. Update `ERROR_HISTORY.md` jika ada error yang difix
4. Update `LESSONS_LEARNED.md` jika ada pelajaran baru
5. Catat keputusan di `DECISIONS.md` jika ada keputusan baru
6. Update `context/` summary files
7. Commit dengan format: `feat:` / `fix:` / `docs:` / `refactor:`

---

## 🚪 COMPLETION GATE — Gerbang Penyelesaian

> **ATURAN MUTLAK:** Setiap task BELUM dianggap selesai sampai dokumentasi wajib diperbarui.
> AI agent DILARANG menyatakan task selesai sebelum Completion Gate terpenuhi.

### Sebelum Menyatakan Task Selesai, AI Agent Wajib:

1. **Menjelaskan file yang diubah** — sebutkan path, alasan perubahan, dan dampaknya.
2. **Memperbarui `ai-context/CURRENT_STATE.md`** — update versi, status fitur, ringkasan perubahan.
3. **Memperbarui `ai-context/TASK_BOARD.md`** — mark task yang selesai (✅ done), update task yang sedang in_progress.
4. **Memperbarui `CHANGELOG.md`** — catat perubahan dengan format: versi, tanggal, jenis (feat/fix/docs/refactor), deskripsi singkat.
5. **Memperbarui `ai-context/DECISIONS.md`** — jika ada keputusan teknis baru yang dibuat selama task (format DEC-XXX).
6. **Memperbarui `ai-context/ERROR_HISTORY.md`** — jika task berkaitan dengan bug/error (format ERR-XXX).
7. **Memperbarui `ai-context/LESSONS_LEARNED.md`** — jika ada pelajaran penting dari task ini (format LL-XXX).

### Checklist Wajib di Akhir Setiap Task

Setiap kali menyelesaikan task, AI agent WAJIB menampilkan checklist ini dan mencentang satu per satu:

```
## ✅ Completion Gate Checklist

- [ ] Kode sudah diubah / commit sudah dipush
- [ ] CURRENT_STATE.md sudah diperbarui
- [ ] TASK_BOARD.md sudah diperbarui
- [ ] CHANGELOG.md sudah diperbarui
- [ ] DECISIONS.md diperbarui (jika ada keputusan teknis baru)
- [ ] ERROR_HISTORY.md diperbarui (jika task berkaitan dengan bug/error)
- [ ] LESSONS_LEARNED.md diperbarui (jika ada pelajaran penting)
```

### Konsekuensi Pelanggaran

- Task yang dinyatakan selesai tanpa Completion Gate = **TIDAK SAH.**
- AI agent WAJIB mengulang dari langkah dokumentasi yang terlewat.
- Human berhak menolak hasil kerja jika checklist tidak lengkap.

---

## 🧠 Konteks Project

### Apa ini?
**Lokasi Sekitar** — aplikasi Android crowdsourcing lokasi PKL (Pedagang Kaki Lima).
Tiga role: **Informan** (lapor), **Pedagang** (konsumsi info), **Admin** (verifikasi).

### Tech Stack
- **Capacitor 5** → bungkus web app jadi APK Android
- **Vanilla JS** → single file `www/index.html`
- **Supabase** → backend (PostgreSQL + Auth + Storage + Realtime)
- **Leaflet.js** → peta OpenStreetMap
- **GitHub Actions** → CI/CD build APK

### Cara Kerja
- Web app (`www/index.html`) berjalan di WebView Capacitor
- Capacitor bridge menyediakan akses ke kamera, GPS native
- Semua data disimpan di Supabase (PostgreSQL)
- Foto di Supabase Storage
- APK di-build via GitHub Actions (karena develop di Termux, tidak ada Android Studio)

### Kondisi Saat Ini
- **Versi:** 2.2.0 (Leaderboard + Profil + Badge + Realtime Notifikasi)
- **File utama:** `www/index.html` — 1.343 baris, 47 fungsi
- **Dokumentasi:** 30 file di 5 folder (docs/, architecture/, engineering/, ai-context/, context/)
- **Status:** Stabil, semua fitur core sudah jalan

---

## 🔗 File Reference Cepat

| Butuh tahu... | Baca... |
|---------------|---------|
| Visi & model bisnis | `docs/business-vision.md` |
| Fitur & user stories | `docs/prd.md` |
| Siapa usernya | `docs/user_personas.md` |
| Aturan bisnis (BR-xxx) | `docs/business_rules.md` |
| Istilah baku | `docs/glossary.md` |
| Gambaran sistem | `architecture/system_map.md` |
| Keputusan arsitektur | `architecture/architecture.md` |
| Library & tools | `architecture/tech_stack.md` |
| Map modul ke file | `architecture/module_map.md` |
| Alur data detail | `architecture/data_flow.md` |
| Sequence diagram | `architecture/sequence_diagrams.md` |
| Aturan coding | `engineering/coding_rules.md` |
| Struktur folder | `engineering/folder_structure.md` |
| API contract | `engineering/api_contract.md` |
| Database schema | `engineering/database_schema.md` |
| Aturan keamanan | `engineering/security_rules.md` |
| Error handling | `engineering/error_handling.md` |
| Aturan performa | `engineering/performance_rules.md` |
| **Error history** | `ai-context/ERROR_HISTORY.md` |
| **Pelajaran** | `ai-context/LESSONS_LEARNED.md` |
| Sejarah project | `ai-context/PROJECT_MEMORY.md` |
| Keputusan teknis | `ai-context/DECISIONS.md` |
| Kondisi saat ini | `ai-context/CURRENT_STATE.md` |
| Board task | `ai-context/TASK_BOARD.md` |

---

## ⚠️ Hal-Hal yang Sering Salah

1. **JANGAN pakai `loading="lazy"` di img tag** — merusak layout di Capacitor WebView Android. Gunakan CSS `.thumb` 50x50. (LL-001)
2. **JANGAN edit folder `android/`** — itu generated oleh `npx cap sync android`
3. **JANGAN commit keystore atau .env** — sudah di `.gitignore`
4. **JANGAN pakai `alert()`** — pakai `showToast()` custom
5. **JANGAN fetch langsung ke REST endpoint** — selalu via Supabase client
6. **JANGAN taruh user input langsung ke innerHTML** — selalu pakai `escapeHtml()`
7. **JANGAN ganti arsitektur karena error** — error lokal tidak butuh perubahan global
8. **VERIFIKASI escaping setelah pakai `patch()`** — tool bisa double-escape backslash (ERR-004, LL-006)

---

## 📞 Kontak

- **Human:** Pa Popo
- **Repo:** `github.com/popolalala89-cell/lokasi-sekitar`
- **CI/CD:** GitHub Actions (push main → debug APK, tag v* → release APK)

---

## ✅ COMPLETION GATE — Mekanisme Penyelesaian Task

> **WAJIB:** Setiap task belum dianggap **selesai** sampai semua poin di bawah ini terpenuhi.
> Jangan menyatakan task selesai sebelum checklist lengkap terisi.

### Aturan Wajib
Sebelum menyatakan task selesai, AI agent **WAJIB**:
1. Menjelaskan file yang diubah (termasuk apa yang ditambah, diubah, atau dihapus)
2. Memperbarui `CURRENT_STATE.md` dengan kondisi project terkini
3. Memperbarui `TASK_BOARD.md` (menandai task sebagai selesai)
4. Memperbarui `CHANGELOG.md` dengan entri baru untuk perubahan ini
5. Memperbarui `DECISIONS.md` jika ada keputusan teknis baru
6. Memperbarui `ERROR_HISTORY.md` jika task terkait dengan perbaikan bug/error
7. Memperbarui `LESSONS_LEARNED.md` jika ada pelajaran penting dari task ini

### Checklist Wajib (Harus Muncul di Akhir Setiap Task)
Setelah semua perubahan dibuat, sertakan checklist berikut dan pastikan semua item tercentang:
- [ ] Kode sudah diubah
- [ ] `CURRENT_STATE.md` sudah diperbarui
- [ ] `TASK_BOARD.md` sudah diperbarui
- [ ] `CHANGELOG.md` sudah diperbarui
- [ ] `DECISIONS.md` diperbarui jika diperlukan
- [ ] `ERROR_HISTORY.md` diperbarui jika diperlukan
- [ ] `LESSONS_LEARNED.md` diperbarui jika diperlukan

### Sanksi Pelanggaran
AI agent **TIDAK BOLEH** menyatakan task selesai sebelum Completion Gate terpenuhi.
Pelanggaran aturan ini akan menyebabkan pekerjaan ditolak dan harus diulang.

---

## 🧠 Konteks Project
*File ini adalah living document — update setiap kali ada aturan baru.*
