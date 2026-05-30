# 📍 LOKASI SEKARANG - Setup di Termux

## 1. Install Node.js (jika belum)
```bash
pkg install nodejs
```

## 2. Masuk ke folder project
```bash
cd ~/lokasi-sekitar-capacitor
```

## 3. Jalankan setup
```bash
./setup.sh
```

## 4. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit - Lokasi Sekitar"

# Ganti dengan username GitHub Pa
git remote add origin https://github.com/Cibay89/lokasi-sekitar.git
git branch -M main
git push -u origin main
```

## 5. Download APK
1. Buka https://github.com/Cibay89/lokasi-sekitar/actions
2. Klik workflow run terbaru
3. Scroll ke **Artifacts** → download `lokasi-sekitar-debug.apk`
4. Install di HP Android

## 6. Update App (setelah ada perubahan code)
```bash
git add .
git commit -m "Update: [deskripsi perubahan]"
git push
```

APK baru otomatis build dalam 5-10 menit!

---

**Catatan:**
- Folder `android/` di-generate otomatis, jangan edit manual
- Setiap push = build APK baru
- Gratis 2000 menit build/bulan di GitHub Actions
