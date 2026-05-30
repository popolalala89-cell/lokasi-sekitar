# AGENTS.md — Wajib Dibaca oleh Setiap AI Agent

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **PERHATIAN:** Kamu adalah AI agent yang bekerja di project **Lokasi Sekitar**.
> BACA SELURUH file ini SEBELUM menulis atau mengubah kode apa pun.
> File ini adalah **kontrak kerja** antara human (Pa Popo) dan AI agent (kamu).

---

## 🚨 ATURAN PERTAMA & TERPENTING

### 1. JANGAN MULAI CODING SEBELUM BACA DOKUMENTASI

Setiap kali kamu menerima tugas, baca dokumen berikut **dengan urutan ini:**
1. `ai-context/CURRENT_STATE.md` — kondisi project saat ini
2. `ai-context/TASK_BOARD.md` — apa yang sedang dikerjakan
3. `ai-context/DECISIONS.md` — keputusan yang sudah dibuat
4. `engineering/coding_rules.md` — aturan coding

### 2. JANGAN UBAH ARSITEKTUR TANPA PERSETUJUAN

- Jangan tambah dependency npm baru tanpa tanya dulu
- Jangan split file `www/index.html` tanpa persetujuan eksplisit
- Jangan ubah struktur folder tanpa update `engineering/folder_structure.md`
- Setiap keputusan teknis HARUS dicatat di `ai-context/DECISIONS.md`

### 3. JANGAN HAPUS KODE EXISTING

- Project ini sudah berjalan (v2.0). Kode yang ada sudah bekerja.
- Kalau mau refactor, pastikan behavior tidak berubah.
- Kalau mau hapus, pastikan tidak ada yang pakai.

---

## 📋 Alur Kerja Agent

### Sebelum Mengerjakan Tugas
1. Baca `CURRENT_STATE.md` dan `TASK_BOARD.md`
2. Baca file yang akan diubah (pakai `read_file`)
3. Baca aturan terkait di `engineering/` dan `docs/business_rules.md`
4. Konfirmasi pemahaman ke user jika ambigu

### Saat Mengerjakan Tugas
1. Tulis kode sesuai `engineering/coding_rules.md`
2. Update `context/` setelah perubahan signifikan
3. Jangan break fitur yang sudah ada
4. Test secara manual dengan membaca ulang kode

### Setelah Mengerjakan Tugas
1. Update `CURRENT_STATE.md`
2. Update `TASK_BOARD.md` (mark selesai)
3. Catat keputusan di `DECISIONS.md` jika ada keputusan baru
4. Update `context/` summary files
5. Commit dengan format: `feat:` / `fix:` / `docs:`

---

## 🧠 Konteks Project

### Apa ini?
**Lokasi Sekitar** — aplikasi Android crowdsourcing lokasi PKL (Pedagang Kaki Lima).
Tiga role: **Informan** (lapor), **Pedagang** (konsumsi info), **Admin** (verifikasi).

### Tech Stack
- **Capacitor 5** → bungkus web app jadi APK Android
- **Vanilla JS** → single file `www/index.html`
- **Supabase** → backend (PostgreSQL + Auth + Storage)
- **Leaflet.js** → peta OpenStreetMap
- **GitHub Actions** → CI/CD build APK

### Cara Kerja
- Web app (`www/index.html`) berjalan di WebView Capacitor
- Capacitor bridge menyediakan akses ke kamera, GPS native
- Semua data disimpan di Supabase (PostgreSQL)
- Foto di Supabase Storage
- APK di-build via GitHub Actions (karena develop di Termux, tidak ada Android Studio)

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

---

## ⚠️ Hal-Hal yang Sering Salah

1. **JANGAN pakai `loading="lazy"` di img tag** — merusak layout di Capacitor WebView Android. Gunakan CSS `.thumb` 50x50.
2. **JANGAN edit folder `android/`** — itu generated oleh `npx cap sync android`
3. **JANGAN commit keystore atau .env** — sudah di `.gitignore`
4. **JANGAN pakai `alert()`** — pakai `showToast()` custom
5. **JANGAN fetch langsung ke REST endpoint** — selalu via Supabase client
6. **JANGAN taruh user input langsung ke innerHTML** — selalu escape dulu

---

## 📞 Kontak

- **Human:** Pa Popo
- **Repo:** `github.com/popolalala89-cell/lokasi-sekitar`
- **CI/CD:** GitHub Actions (push main → debug APK, tag v* → release APK)

---

*Agent yang melanggar aturan ini = pekerjaannya ditolak.*
