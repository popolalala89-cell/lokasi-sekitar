# Lokasi Sekitar 📍

Aplikasi mobile crowdsourcing lokasi PKL (Pedagang Kaki Lima). Informan lapor, pedagang pantau, admin verifikasi.

## Fitur

- 📸 **Informan**: Lapor lokasi PKL + foto via GPS
- 🛒 **Pedagang**: Lihat laporan sekitar, beri poin, kelola dagangan
- 🛡️ **Admin**: Verifikasi/tolak laporan, dashboard statistik
- 🗺️ **Peta**: Lihat semua lokasi PKL di peta interaktif
- ⭐ **Poin**: Sistem gamifikasi — informan dapat poin per laporan

## Tech Stack

- **Capacitor 5** — Hybrid app framework (Android APK)
- **Vanilla JS** — No framework, lightweight single-file app
- **Supabase** — Auth, database PostgreSQL, storage foto
- **Leaflet.js** — Peta OpenStreetMap interaktif
- **GitHub Actions** — CI/CD build APK otomatis

## Struktur Project

```
lokasi-sekitar/
├── www/                      # Web app
│   ├── index.html            # Single-file app (HTML+CSS+JS)
│   └── lib/                  # Supabase, Leaflet
├── android/                  # Generated Capacitor (jangan edit manual)
├── .github/workflows/        # CI/CD build APK
│   └── android-build.yml
├── supabase-*.sql            # Schema + RLS + Storage policies
├── capacitor.config.json
├── package.json
└── README.md
```

## Setup Development

```bash
cd ~/lokasi-sekitar

# Install dependencies
npm install

# Sync Capacitor (generate android/)
npx cap sync android
```

## Build APK

### Otomatis via GitHub Actions
Push ke `main` = build debug APK. Tag `v*` = build release APK (signed).

1. Push / tag ke GitHub
2. Buka repo → **Actions** tab
3. Download APK dari **Artifacts**

### Manual (perlu Android SDK)
```bash
cd android
./gradlew assembleDebug
```

## Deploy ke GitHub

```bash
git clone git@github.com:popolalala89-cell/lokasi-sekitar.git
cd lokasi-sekitar
# ... edit code ...
git add . && git commit -m "deskripsi" && git push
```

## Release APK (Signed)

### 1. Buat Keystore
```bash
keytool -genkey -v \
  -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias lokasi-sekitar
```

### 2. Simpan ke GitHub Secrets
Encode keystore ke base64, simpan di **Repo Settings → Secrets → Actions**:
- `ANDROID_KEYSTORE` — output `base64 -w 0 my-release-key.jks`
- `KEYSTORE_PASSWORD` — password keystore
- `KEY_ALIAS` — `lokasi-sekitar`
- `KEY_PASSWORD` — password key

### 3. Tag & Push
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Status Workflow

```
Laporan baru → pending
  ├── Admin verifikasi → diverifikasi (+10 poin)
  └── Admin tolak → ditolak
```

## License

MIT © 2026 Pa Popo
