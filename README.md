# Lokasi Sekitar 📍

Aplikasi mobile untuk crowdsourcing lokasi PKL di sekitar kamu. Terintegrasi dengan Telegram bot @LokasiSekitarBot.

## Fitur

- 📍 Bagikan lokasi ramai via GPS
- 🗺️ Lihat lokasi PKL terdekat
- 🔗 Integrasi Telegram bot
- 📱 Aplikasi Android native (Capacitor)

## Setup Development di Termux

```bash
cd lokasi-sekitar-capacitor

# Install dependencies
npm install

# Sync Capacitor (buat folder android/)
npx cap sync android
```

## Build APK

### Otomatis (GitHub Actions)
Setiap push ke `main` akan otomatis build APK:

1. Push code ke GitHub
2. Buka repo → **Actions** tab
3. Download APK dari **Artifacts**

### Manual (perlu Android SDK)
```bash
cd android
./gradlew assembleDebug
```

## Deploy ke GitHub

```bash
git init
git add .
git commit -m "Initial commit - Lokasi Sekitar v1.0"

# Ganti dengan repo GitHub Pa
git remote add origin https://github.com/Cibay89/lokasi-sekitar.git
git branch -M main
git push -u origin main
```

## Release APK (Signed)

### 1. Buat Keystore
```bash
keytool -genkey -v \
  -keystore my-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias lokasi-sekitar
```

### 2. Simpan ke GitHub Secrets
```bash
# Encode keystore
base64 -w 0 my-release-key.jks
```

Simpan di **Repo Settings → Secrets and variables → Actions**:
- `ANDROID_KEYSTORE`: output base64 di atas
- `KEYSTORE_PASSWORD`: password keystore
- `KEY_ALIAS`: `lokasi-sekitar`
- `KEY_PASSWORD`: password key

### 3. Tag Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Struktur Project

```
lokasi-sekitar-capacitor/
├── www/                    # Web app (HTML/CSS/JS)
│   ├── index.html
│   └── app.js
├── android/                # Generated (jangan edit manual)
├── .github/workflows/      # GitHub Actions
├── capacitor.config.json   # Capacitor config
├── package.json
└── README.md
```

## Tech Stack

- **Capacitor 6** - Framework hybrid app
- **Vanilla JS** - No framework, lightweight
- **GitHub Actions** - CI/CD build APK
- **Telegram Bot API** - Backend integration

## License

MIT © 2026 Pa Popo
