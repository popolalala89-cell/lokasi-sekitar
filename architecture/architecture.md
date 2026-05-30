# Architecture — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## Architectural Style

**Fat Client / Thin Backend** — Aplikasi adalah Single-Page Application (SPA) yang berjalan di WebView Capacitor.
Logika bisnis dijalankan di client (JavaScript). Supabase bertindak sebagai backend-as-a-service (BaaS) untuk database, auth, dan storage.

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT (THICK)                     │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │
│  │ Auth Layer │  │ UI Layer   │  │ Business Logic │ │
│  │ • Login    │  │ • Dashboard│  │ • Validasi GPS  │ │
│  │ • Session  │  │ • Camera   │  │ • Poin calc    │ │
│  │ • Role     │  │ • Map      │  │ • Offline queue│ │
│  └────────────┘  └────────────┘  └────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Data Layer                          │ │
│  │  • Supabase JS Client                           │ │
│  │  • localStorage (offline cache)                 │ │
│  │  • Capacitor Plugins (camera, geolocation)      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS (REST + WebSocket)
┌──────────────────────▼───────────────────────────────┐
│              SUPABASE (THIN BACKEND)                 │
│  • PostgreSQL (data)                                 │
│  • Row-Level Security (authorization)                │
│  • Storage S3-compatible (foto)                      │
│  • Auth (email + JWT)                                │
│  • Realtime (WebSocket broadcast)                    │
└──────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

### 1. Presentation Layer (UI)
- File: `www/index.html` (single-file SPA)
- Tampilan berbeda berdasarkan role: admin, informan, pedagang
- Tidak ada framework — vanilla JS + DOM manipulation
- CSS inline/embedded (tidak ada file CSS terpisah)

### 2. Application Layer (Business Logic)
- File: `<script>` di `www/index.html`
- Fungsi-fungsi: `submitReport()`, `verifySubmission()`, `loadMap()`, dll.
- Validasi client-side sebelum kirim ke Supabase

### 3. Data Access Layer
- Supabase JS client (`@supabase/supabase-js`)
- Semua query via supabase client (tidak ada raw SQL di client)
- Row-Level Security (RLS) di server — client tidak bisa bypass

### 4. Infrastructure Layer
- Capacitor wrapper: Android WebView + plugin bridge
- CI/CD: GitHub Actions build APK otomatis
- Device APIs: kamera, GPS, file system via Capacitor plugins

---

## Key Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Vanilla JS (no framework)** | Ringan, APK kecil, no build step | Manual DOM, lebih verbose |
| **Single HTML file** | Simpel, 1 file edit, cepat load | Bisa besar (>2000 baris) |
| **Supabase BaaS** | Auth, DB, Storage, RLS built-in | Vendor lock-in, biaya scale |
| **Capacitor (bukan React Native)** | Web stack, dikerjakan di Termux | Performa WebView < native |
| **GitHub Actions CI/CD** | Gratis, no Android Studio needed | Build time ~5 menit |

---

## Communication Patterns

| Pattern | Tech | Use Case |
|---------|------|----------|
| **REST (via Supabase client)** | HTTPS | CRUD data (laporan, user, misi) |
| **WebSocket (Supabase Realtime)** | WSS | Notifikasi laporan baru, status update |
| **Plugin Bridge** | Capacitor API | Akses kamera, GPS, filesystem |
| **localStorage** | Browser API | Offline queue, session cache |

---

## Error Handling Strategy

```
[Error terjadi di client]
        │
        ▼
┌──────────────────────┐
│ Tampilkan toast/alert│
│ ke user (non-teknis) │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Log ke console       │
│ (untuk debugging)    │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Retry otomatis       │
│ (maks 3x, backoff)   │
└──────────────────────┘
```

---

*Setiap perubahan arsitektur harus di-review dan dicatat di DECISIONS.md.*
