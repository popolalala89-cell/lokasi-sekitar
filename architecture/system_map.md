# System Map — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## High-Level System Context

```
┌──────────────────────────────────────────────────────────────────┐
│                        LOKASI SEKITAR                            │
│                                                                  │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────────┐ │
│  │  ANDROID │     │   CAPACITOR  │     │      SUPABASE        │ │
│  │   APK    │────→│    WEB APP   │────→│   (BaaS Backend)     │ │
│  │           │     │   (HTML+JS)  │     │                      │ │
│  └──────────┘     └──────────────┘     │  • PostgreSQL (DB)   │ │
│       │                                 │  • Auth (email)      │ │
│       │  Native APIs                    │  • Storage (foto)    │ │
│       ▼                                 │  • RLS (security)    │ │
│  ┌──────────┐                           │  • Realtime (WS)     │ │
│  │ DEVICE   │                           └──────────────────────┘ │
│  │ • Kamera │                                                     │
│  │ • GPS    │                          ┌──────────────────────┐ │
│  │ • Storage│                          │    CI/CD PIPELINE    │ │
│  └──────────┘                          │   GitHub Actions     │ │
│                                        │   • Build APK        │ │
│  ┌──────────┐                          │   • Sign release     │ │
│  │ TERMUX   │                          └──────────────────────┘ │
│  │ • Node.js│                                                     │
│  │ • npm    │                          ┌──────────────────────┐ │
│  │ • git    │                          │    ADMIN INTERFACE   │ │
│  └──────────┘                          │   • HP (mobile)      │ │
│                                        │   • Laptop (desktop) │ │
└──────────────────────────────────────────────────────────────────┘
```

---

## System Boundaries

### Boundary 1: Client Device (Android)
```
┌─────────────────────────────────┐
│ ANDROID DEVICE (User)           │
│                                 │
│  ┌───────────┐ ┌──────────────┐│
│  │ Kamera    │ │ GPS Sensor   ││
│  └─────┬─────┘ └──────┬───────┘│
│        │              │        │
│  ┌─────▼──────────────▼───────┐│
│  │    Capacitor WebView       ││
│  │    (www/index.html)        ││
│  └─────────────┬──────────────┘│
│                │               │
│  ┌─────────────▼──────────────┐│
│  │  localStorage (offline)    ││
│  └────────────────────────────┘│
└─────────────────────────────────┘
```

### Boundary 2: Supabase Cloud
```
┌────────────────────────────────────┐
│ SUPABASE PROJECT                  │
│                                    │
│  ┌──────────┐  ┌───────────────┐  │
│  │ Auth     │  │ Database      │  │
│  │ • email  │  │ • PostgreSQL  │  │
│  │ • JWT    │  │ • RLS Policies│  │
│  └──────────┘  └───────────────┘  │
│                                    │
│  ┌──────────┐  ┌───────────────┐  │
│  │ Storage  │  │ Realtime      │  │
│  │ • foto   │  │ • WebSocket   │  │
│  │ • bucket │  │ • Broadcast   │  │
│  └──────────┘  └───────────────┘  │
└────────────────────────────────────┘
```

### Boundary 3: CI/CD (GitHub Actions)
```
┌────────────────────────────────────┐
│ GITHUB ACTIONS                     │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Debug Build (push main)      │ │
│  │ • npm install                │ │
│  │ • npx cap sync android       │ │
│  │ • ./gradlew assembleDebug    │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Release Build (tag v*)       │ │
│  │ • npm install                │ │
│  │ • npx cap sync android       │ │
│  │ • ./gradlew assembleRelease  │ │
│  │ • Sign APK with keystore     │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

## Data Flow Summary

```
[Informan] → Foto+GPS → [WebView] → Supabase Storage
                                        ↓
                                   [Supabase DB]
                                        ↓
                                   Admin verifikasi
                                        ↓
[Pedagang] ← Peta+Info ← [WebView] ← Supabase DB
```

---

## External Dependencies

| Service | Dependency Level | Fallback |
|---------|-----------------|----------|
| Supabase | Critical — app blank tanpa backend | Tidak ada |
| OpenStreetMap | Medium — peta blank tanpa tiles | Cache tiles |
| GitHub Actions | Low — hanya untuk build APK | Build manual |
| npm registry | Low — hanya saat setup/install | package-lock.json |

---

*Update system map setiap kali ada komponen baru ditambahkan.*
