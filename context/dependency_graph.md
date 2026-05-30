# Dependency Graph — Lokasi Sekitar

> **Auto-generated:** 31 Mei 2026 | **Source:** package.json + import analysis
>
> ⚠️ Visualisasi dependensi. Update setiap kali tambah/hapus dependency.

---

## NPM Dependencies

```
lokasi-sekitar@2.0.0
│
├── @capacitor/core@5.7.0
│   └── (Capacitor runtime — bridge WebView ↔ Native)
│
├── @capacitor/cli@5.7.0
│   └── (CLI — npx cap sync, npx cap open)
│
├── @capacitor/android@5.7.0
│   └── (Android platform support)
│
└── @supabase/supabase-js@2.39.0
    ├── @supabase/postgrest-js (REST API)
    ├── @supabase/gotrue-js (Auth)
    ├── @supabase/storage-js (Storage)
    └── @supabase/realtime-js (WebSocket)
```

---

## Browser/CDN Dependencies

```
www/index.html
│
├── Leaflet.js (~42KB)
│   ├── leaflet.js (script)
│   └── leaflet.css (style)
│
└── (Supabase JS bundle — via npm, bundled di www/lib/)
```

---

## Capacitor Plugin Dependencies

```
@capacitor/core
│
├── @capacitor/camera (⏳ belum diinstall)
│   └── Akses kamera native
│
├── @capacitor/geolocation (⏳ belum diinstall)
│   └── Akses GPS native
│
├── @capacitor/filesystem (⏳ belum diinstall)
│   └── Baca/tulis file lokal
│
└── @capacitor/splash-screen (✅ di config)
    └── Splash screen saat app dibuka
```

---

## Service Dependencies (External)

```
Lokasi Sekitar App
│
├── Supabase (Critical — app tidak jalan tanpa ini)
│   ├── Auth Service (email login)
│   ├── PostgreSQL Database (data)
│   ├── Storage Service (foto)
│   └── Realtime Service (notifikasi — coming soon)
│
├── OpenStreetMap (Medium — peta blank tanpa ini)
│   └── Tile Server (tile.openstreetmap.org)
│
├── GitHub (Low — hanya untuk build)
│   ├── Git Repository (source control)
│   └── GitHub Actions (CI/CD build APK)
│
└── npm Registry (Low — hanya saat setup)
    └── Package download
```

---

## File Dependency Map

```
www/index.html (single source file)
│
├── Membaca dari:
│   ├── capacitor.config.json (appId, plugins)
│   └── .env / window.ENV (SUPABASE_URL, SUPABASE_ANON_KEY)
│
├── Menulis ke:
│   ├── localStorage (offline queue, session cache)
│   └── Supabase (via JS client)
│
└── Diproses oleh:
    ├── npx cap sync android → android/ folder
    └── GitHub Actions → .apk file
```

---

## Build Dependency Chain

```
[Source: www/index.html]
        │
        ▼
[npm install] ──── package.json, package-lock.json
        │
        ▼
[npx cap sync android] ──── capacitor.config.json
        │
        ▼
[./gradlew assembleDebug/Release] ──── android/ (generated)
        │
        ▼
[Sign APK] ──── keystore (GitHub Secrets)
        │
        ▼
[Upload Artifacts] ──── .apk file (downloadable)
```

---

## Critical Path

> **Jika service ini down, apa yang terjadi?**

| Service | Impact | Recovery |
|---------|--------|----------|
| Supabase down | App tidak bisa login, lapor, lihat data | Tidak ada (menunggu) |
| Supabase Storage down | Upload foto gagal | Offline queue |
| OpenStreetMap down | Peta blank | Placeholder "Peta tidak tersedia" |
| GitHub Actions down | Tidak bisa build APK baru | Build manual (jika ada laptop) |

---

*Update setelah setiap perubahan dependency.*
