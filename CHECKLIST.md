# Development Checklist — Lokasi Sekitar

> **Versi:** 1.0 | **Dibuat:** 31 Mei 2026
>
> Urutan development yang HARUS diikuti. Jangan lompat-lompat.
> Checklist ini adalah KONTRAK antara Pa Popo (human) dan AI agent.

---

## FASE 0: SETUP (sebelum coding)

- [x] **0.1** — Clone repo: `git clone git@github.com:popolalala89-cell/lokasi-sekitar.git`
- [x] **0.2** — `cd ~/lokasi-sekitar && npm install`
- [x] **0.3** — Setup Supabase project (URL + ANON KEY)
- [x] **0.4** — Jalankan SQL schema (`supabase-setup.sql`, dll.)
- [x] **0.5** — `npx cap sync android` → generate folder android/
- [x] **0.6** — Setup GitHub Secrets (ANDROID_KEYSTORE, KEYSTORE_PASSWORD, dll.)
- [x] **0.7** — Push → CI/CD build pertama (debug APK)
- [ ] **0.8** — Download & install debug APK di HP → test jalan
- [x] **0.9** — Baca SEMUA dokumentasi di folder docs/, architecture/, engineering/, ai-context/

---

## FASE 1: FITUR YANG SUDAH ADA (maintenance)

Fitur-fitur ini sudah jalan di v2.0. Task hanya untuk improvement/bug fix.

- [ ] **1.1** — Review `www/index.html` → pastikan sesuai coding_rules.md
- [ ] **1.2** — Install Capacitor plugins yang belum ada: `camera`, `geolocation`, `filesystem`
- [ ] **1.3** — Refactor: beri comment header untuk setiap fungsi (sesuai module_map.md)
- [ ] **1.4** — Tambah `escapeHtml()` di semua render user input (security_rules.md SR-050)
- [ ] **1.5** — Perbaiki offline queue: tambah progress indicator + retry counter
- [ ] **1.6** — Standarisasi error messages (sesuai error_handling.md EH-020)
- [ ] **1.7** — Tambah `showToast()` custom sebagai pengganti `alert()` di seluruh kode
- [ ] **1.8** — Cek semua img tag → hapus `loading="lazy"` (LL-001)
- [ ] **1.9** — Cek GPS offset di peta (50-200m random, BR-070)
- [ ] **1.10** — Test build release APK: `git tag v2.0.1 && git push origin v2.0.1`

---

## FASE 2: v2.1 — MISI & PAKET (P0)

### 2A: Database
- [ ] **2.1** — Buat tabel `missions` di Supabase (jalankan SQL migration)
- [ ] **2.2** — Buat tabel `packages` di Supabase
- [ ] **2.3** — Tambah RLS policies untuk kedua tabel
- [ ] **2.4** — Update file SQL di folder `supabase/`
- [ ] **2.5** — Update `engineering/database_schema.md`
- [ ] **2.6** — Update `context/latest_schema_summary.md`

### 2B: Backend Logic
- [ ] **2.7** — Trigger: auto-close misi saat deadline
- [ ] **2.8** — Trigger: kurangi quota_used saat pedagang lihat laporan dari misi
- [ ] **2.9** — Function: validasi budget poin saat buat misi

### 2C: UI — Pedagang
- [ ] **2.10** — Form "Buat Misi" (title, area, budget, deadline)
- [ ] **2.11** — List misi aktif milik sendiri
- [ ] **2.12** — Detail misi: laporan yang masuk + status
- [ ] **2.13** — Tombol "Beri Poin" untuk setiap laporan di misi

### 2D: UI — Informan
- [ ] **2.14** — Halaman "Cari Misi" — list misi aktif terdekat
- [ ] **2.15** — Integrasi laporan dengan misi: pilih misi sebelum lapor
- [ ] **2.16** — Lihat riwayat partisipasi misi

### 2E: UI — Paket
- [ ] **2.17** — Halaman "Beli Paket" untuk pedagang
- [ ] **2.18** — Tampilkan sisa kuota + expired date
- [ ] **2.19** — Notifikasi "kuota hampir habis"

### 2F: Payment (opsional v2.1)
- [ ] **2.20** — Integrasi payment (QRIS/manual transfer confirmation)
- [ ] **2.21** — Admin verifikasi pembayaran → aktifkan paket

---

## FASE 3: v2.2 — GAMIFIKASI & NOTIFIKASI (P1)

- [ ] **3.1** — Setup Supabase Realtime subscription
- [ ] **3.2** — Notifikasi: laporan diverifikasi (ke informan)
- [ ] **3.3** — Notifikasi: laporan baru masuk (ke admin)
- [ ] **3.4** — Notifikasi: misi deadline (ke pedagang)
- [ ] **3.5** — Leaderboard informan (bulanan, total poin)
- [ ] **3.6** — Leaderboard informan (mingguan, poin terbanyak)
- [ ] **3.7** — Badge/achievement: "10 Laporan", "50 Laporan", "Top 10%"
- [ ] **3.8** — Profile page: foto + statistik + badge

---

## FASE 4: v3.0 — SCALE (P2)

- [ ] **4.1** — Multi-kota: tambah field kota + filter
- [ ] **4.2** — AI auto-verifikasi: cek foto (blur/hitam) + GPS (akurasi)
- [ ] **4.3** — Bulk approve untuk admin
- [ ] **4.4** — Dashboard statistik lanjutan untuk pedagang
- [ ] **4.5** — Export data CSV (admin)
- [ ] **4.6** — Referral system: kode referral → bonus poin
- [ ] **4.7** — Split `www/index.html` jadi multi-file (jika sudah >3000 baris)
- [ ] **4.8** — Tambah automated testing (minimal manual test checklist)

---

## SETIAP KALI SELESAI TASK, WAJIB:

1. [ ] Update `ai-context/CURRENT_STATE.md`
2. [ ] Update `ai-context/TASK_BOARD.md` (mark done)
3. [ ] Update `context/latest_feature_summary.md`
4. [ ] Update `context/latest_api_summary.md` (jika query berubah)
5. [ ] Update `context/latest_schema_summary.md` (jika schema berubah)
6. [ ] Catat keputusan di `ai-context/DECISIONS.md` (jika ada)
7. [ ] Update `ai-context/PROJECT_MEMORY.md` (jika ada pelajaran baru)
8. [ ] Git commit dengan format: `feat:` / `fix:` / `docs:` / `refactor:`
9. [ ] Push ke GitHub → cek CI/CD build sukses

---

## ATURAN UNTUK AI AGENT BERIKUTNYA

Setiap AI agent yang mengerjakan task di project ini WAJIB:

1. **BACA `ai-context/AGENTS.md`** — ini kontrak kerja. Pelanggaran = task ditolak.
2. **BACA file yang mau diubah** — jangan asumsikan isinya.
3. **IKUTI checklist ini** — jangan lompat fase.
4. **JANGAN ngelantur** — kerjakan task yang diminta saja, jangan tambah fitur sendiri.
5. **TANYA jika ambigu** — lebih baik tanya daripada asumsi salah.
6. **UPDATE dokumentasi** — setelah coding, update file terkait.
7. **COMMIT per task** — jangan gabung banyak perubahan dalam 1 commit.

---

*Checklist ini adalah living document — update setelah setiap sprint planning.*
