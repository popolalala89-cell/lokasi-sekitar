# DECISIONS.md — Log Keputusan Teknis

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **TUJUAN:** Mencatat SETIAP keputusan teknis beserta ALASANNYA.
> "Why did we do it this way?" harus selalu bisa dijawab dengan file ini.

---

## Format Keputusan

```
### DEC-XXX: Judul Keputusan
- **Tanggal:** YYYY-MM-DD
- **Status:** Proposed / Accepted / Deprecated / Superseded by DEC-YYY
- **Context:** Kenapa keputusan ini perlu dibuat?
- **Decision:** Apa yang diputuskan?
- **Alternatives considered:** Opsi lain yang dipertimbangkan
- **Consequences:** Dampak dari keputusan ini (positif & negatif)
```

---

## DEC-001: Capacitor sebagai Platform (bukan Telegram Mini App)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Plan awal adalah Telegram Mini App. User ingin aplikasi standalone yang bisa diinstal sebagai APK.
- **Decision:** Gunakan Capacitor — web app dibungkus jadi APK Android. Develop di Termux, build via GitHub Actions.
- **Alternatives considered:**
  - React Native: terlalu kompleks, butuh Mac, tidak bisa dari Termux
  - Flutter: butuh Android Studio, tidak cocok untuk Termux
  - PWA: user tidak familiar, tidak bisa di Play Store
- **Consequences:**
  - ✅ Develop pakai web stack (HTML+JS+CSS) — bisa dari Termux
  - ✅ Build APK otomatis via GitHub Actions
  - ❌ Performa tidak se-native React Native/Flutter
  - ❌ WebView quirks (loading="lazy" bug, dll.)

---

## DEC-002: Vanilla JS (Tidak Pakai Framework)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Perlu stack yang ringan, bisa diedit dari Termux tanpa build step, APK kecil.
- **Decision:** Vanilla JS — tidak pakai React, Vue, atau Svelte. Semua kode dalam 1 file HTML.
- **Alternatives considered:**
  - React: butuh build step (webpack/vite), node_modules besar (~200MB)
  - Svelte: ringan tapi tetap butuh compiler
  - Alpine.js: dipertimbangkan tapi memilih vanilla untuk kontrol penuh
- **Consequences:**
  - ✅ APK < 10MB
  - ✅ No build step — edit langsung, langsung jadi
  - ❌ DOM manipulation manual & verbose
  - ❌ Tidak ada reactivity — harus manage state manual
  - ❌ Susah scaling kalau app makin besar

---

## DEC-003: Single HTML File (bukan Multi-File)
- **Tanggal:** 2026-05-30
- **Status:** Accepted (akan di-review jika file > 3000 baris)
- **Context:** Aplikasi masih kecil. Multi-file butuh module system.
- **Decision:** Semua HTML+CSS+JS dalam `www/index.html`.
- **Alternatives considered:**
  - Multi-file HTML: butuh routing/navigation antar file
  - ES Modules: butuh server (tidak bisa `file://` protocol)
- **Consequences:**
  - ✅ Cepat load (1 file)
  - ✅ Mudah diedit (1 file)
  - ❌ File bisa besar (>2000 baris)
  - ❌ Susah parallel development

---

## DEC-004: Supabase sebagai Backend (bukan Server Sendiri)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Butuh backend untuk auth, database, storage. Tidak mau manage server sendiri.
- **Decision:** Gunakan Supabase (BaaS) — PostgreSQL + Auth + Storage + Realtime.
- **Alternatives considered:**
  - Firebase: proprietary, Firestore bukan SQL, vendor lock-in
  - Custom server (Express/Hono): butuh VPS, maintenance, downtime risk
- **Consequences:**
  - ✅ Auth, DB, Storage built-in — gak perlu bikin dari nol
  - ✅ RLS (Row-Level Security) — keamanan di database level
  - ✅ Gratis untuk skala kecil (50K rows, 1GB storage)
  - ❌ Vendor lock-in ke Supabase
  - ❌ Rate limit (200 req/jam untuk Auth free tier)
  - ❌ Tidak bisa kustomisasi backend logic (harus via DB triggers/functions)

---

## DEC-005: GitHub Actions CI/CD (bukan Build Manual)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Termux tidak bisa build APK (tidak support Android SDK).
- **Decision:** Setiap push ke GitHub → GitHub Actions build APK otomatis.
- **Alternatives considered:**
  - Android Studio di laptop: tidak selalu available
  - Build server VPS: tambah biaya
- **Consequences:**
  - ✅ Build otomatis setiap push/tag
  - ✅ Debug APK unsigned (push main), Release APK signed (tag v*)
  - ✅ Gratis 2000 menit/bulan
  - ❌ Tidak bisa test APK langsung dari Termux — harus download dari Actions

---

## DEC-006: Database Trigger untuk Poin (bukan di Client)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Pemberian poin harus atomik dan tidak bisa dimanipulasi client.
- **Decision:** Poin ditambahkan via PostgreSQL TRIGGER (`award_points_on_verify`), bukan dari JavaScript client.
- **Alternatives considered:**
  - Client-side update: rawan manipulasi (user bisa bypass JS)
  - Edge Function: butuh Supabase Pro (berbayar)
- **Consequences:**
  - ✅ Atomic — tidak bisa dimanipulasi client
  - ✅ Audit trail otomatis (trigger insert ke transactions)
  - ❌ Logic di database (kurang fleksibel dibanding server code)

---

## DEC-007: Leaflet.js + OpenStreetMap (bukan Google Maps)
- **Tanggal:** 2026-05-30
- **Status:** Accepted
- **Context:** Butuh peta untuk menampilkan lokasi PKL.
- **Decision:** Leaflet.js + OpenStreetMap tiles.
- **Alternatives considered:**
  - Google Maps: butuh API key + billing, quota terbatas di free tier
  - Mapbox: butuh API key, free tier 50K request/bulan
- **Consequences:**
  - ✅ Gratis tanpa API key
  - ✅ Leaflet.js ringan (42KB)
  - ❌ Tile OpenStreetMap kurang detail di Indonesia
  - ❌ Tidak ada satellite view

---

*Tambahkan DEC baru setiap kali membuat keputusan teknis.*

---

## DEC-008: Completion Gate — Wajib Update 7 Dokumentasi Sebelum Task Selesai
- **Tanggal:** 2026-06-01
- **Status:** Accepted
- **Context:** Banyak task yang di-commit tanpa update dokumentasi. CURRENT_STATE, TASK_BOARD, dan CHANGELOG sering stale. Ini menyulitkan tracking progress dan handover antar agent.
- **Decision:** Setiap task wajib melalui Completion Gate — 7 checklist item (kode, CURRENT_STATE, TASK_BOARD, CHANGELOG, DECISIONS, ERROR_HISTORY, LESSONS_LEARNED) harus diperbarui sebelum task dinyatakan selesai. Aturan dicatat di AGENTS.md section "Completion Gate".
- **Alternatives considered:**
  - Auto-generate documentation dari commit messages: terlalu rigid, kehilangan konteks
  - Tidak ada gate: dokumentasi terus stale (status quo)
- **Consequences:**
  - ✅ Dokumentasi selalu up-to-date
  - ✅ Handover antar agent lebih mulus
  - ✅ Human bisa lacak progress tanpa buka kode
  - ❌ Overhead waktu ~2-5 menit per task
  - ❌ Wajib dipatuhi — kalau tidak, task dianggap tidak sah
