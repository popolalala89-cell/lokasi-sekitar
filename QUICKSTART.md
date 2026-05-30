# 📍 Lokasi Sekitar — Quickstart

## 1. Install Node.js (jika belum)
```bash
pkg install nodejs
```

## 2. Clone & setup
```bash
cd ~
git clone git@github.com:popolalala89-cell/lokasi-sekitar.git
cd lokasi-sekitar
npm install
```

## 3. Push perubahan ke GitHub
```bash
git add .
git commit -m "Update: [deskripsi]"
git push origin main
```

## 4. Build APK otomatis
Setiap push ke `main` → build debug APK (~5 menit).

Download dari: https://github.com/popolalala89-cell/lokasi-sekitar/actions

Scroll ke workflow run terbaru → **Artifacts** → `lokasi-sekitar-debug`

## 5. Release APK (signed)
```bash
git tag v1.x.x
git push origin v1.x.x
```
Download dari Artifacts → `lokasi-sekitar-release`

---

**Catatan:**
- Folder `android/` di-generate otomatis, jangan edit manual
- Setiap tag `v*` build release APK signed
- Gratis 2000 menit build/bulan di GitHub Actions
