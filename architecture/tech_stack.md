# Tech Stack — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> Setiap library/tool yang digunakan harus tercatat di sini beserta versi dan alasannya.

---

## Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Capacitor | 5.7.0 | Bungkus web app jadi APK |
| **UI** | HTML5 + Vanilla JS | ES2022 | Single-file SPA |
| **CSS** | Embedded styles | — | No CSS framework |
| **Maps** | Leaflet.js | 1.9.4 | Peta OpenStreetMap interaktif |
| **Backend** | Supabase | JS SDK 2.39.0 | Auth, DB, Storage, Realtime |
| **Database** | PostgreSQL | 15 (Supabase) | Data relational |
| **Storage** | Supabase Storage | S3-compatible | Foto laporan PKL |

---

## Development Environment

| Tool | Version | Purpose |
|------|---------|---------|
| **Termux** | Latest | Terminal + dev environment di Android |
| **Node.js** | 20.x | Runtime JS (via Termux `pkg install nodejs`) |
| **npm** | 10.x | Package manager |
| **git** | Latest | Version control |
| **GitHub** | — | Remote repo + CI/CD + Actions |

---

## CI/CD

| Tool | Purpose |
|------|---------|
| **GitHub Actions** | Build APK otomatis setiap push/tag |
| **Android SDK** (di CI) | `compileSdk 34`, `minSdk 26`, `targetSdk 34` |
| **JDK 17** | Java compiler untuk Android build |
| **Gradle** | Build system Android |

---

## Capacitor Plugins

| Plugin | Purpose | Status |
|--------|---------|--------|
| `@capacitor/camera` | Akses kamera native | ⏳ Belum diinstall |
| `@capacitor/geolocation` | Akses GPS native | ⏳ Belum diinstall |
| `@capacitor/filesystem` | Baca/tulis file | ⏳ Belum diinstall |
| `@capacitor/splash-screen` | Splash screen saat app dibuka | ✅ Di config |

---

## Client Libraries (via CDN atau bundled)

| Library | Load | Purpose |
|---------|------|---------|
| `@supabase/supabase-js` | npm → bundled | Supabase client |
| `leaflet` | CDN / bundled | Peta interaktif |
| `leaflet.css` | CDN / bundled | Style peta |

---

## NOT Used (by Design)

| Tech | Reason NOT Used |
|------|-----------------|
| React / Vue / Svelte | Tambah weight, build step, kompleks |
| TypeScript | Build step tambahan, overhead |
| Tailwind CSS | Tambah config, no build step |
| Firebase | Supabase lebih open (PostgreSQL) |
| Android Studio | Dikerjakan di Termux, build via CI |
| Express / Hono | Supabase sudah handle backend |

---

## Dependency Graph

```
lokasi-sekitar
├── @capacitor/core@5.7.0
├── @capacitor/cli@5.7.0
├── @capacitor/android@5.7.0
└── @supabase/supabase-js@2.39.0
    └── (internal deps: postgrest-js, gotrue-js, storage-js, realtime-js)
```

---

*Update versi library di sini setiap kali `npm update`.*
