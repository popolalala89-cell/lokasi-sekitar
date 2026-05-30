# Data Flow — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## 1. Flow: Informan Mengirim Laporan

```
┌─────────────────────────────────────────────────────────────────────┐
│ INFORMAN MENGIRIM LAPORAN                                           │
│                                                                     │
│  [User tap "Lapor"]                                                 │
│        │                                                            │
│        ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ openCamera()         │  Capacitor Camera plugin                  │
│  │ → Buka kamera native │  (native API)                             │
│  └──────────┬───────────┘                                           │
│             │ foto (base64 / file URI)                              │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ getGPS()             │  Capacitor Geolocation plugin             │
│  │ → Baca GPS device    │  (native API)                             │
│  └──────────┬───────────┘                                           │
│             │ {lat, lng}                                            │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ validateGPS()        │  Cek range Indonesia                      │
│  │ → Validasi koordinat │  lat: -11 s/d 6, lng: 95 s/d 141          │
│  └──────────┬───────────┘                                           │
│             │ valid ✓                                               │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Upload foto ke       │  supabase.storage.from('photos').upload() │
│  │ Supabase Storage     │                                           │
│  └──────────┬───────────┘                                           │
│             │ public_url                                             │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Insert ke tabel      │  supabase.from('submissions').insert()    │
│  │ submissions          │  {foto_url, lat, lng, user_id, status:    │
│  │                      │   'pending', catatan}                     │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Tampilkan toast      │  showToast('Laporan terkirim!')           │
│  │ sukses + refresh UI  │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Flow: Admin Verifikasi Laporan

```
┌─────────────────────────────────────────────────────────────────────┐
│ ADMIN VERIFIKASI LAPORAN                                            │
│                                                                     │
│  [Admin buka dashboard]                                             │
│        │                                                            │
│        ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ loadPendingReports()  │  supabase.from('submissions')            │
│  │ → Query status=      │  .select().eq('status','pending')        │
│  │   pending            │                                           │
│  └──────────┬───────────┘                                           │
│             │ list laporan                                          │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Admin lihat detail:  │  Tampilkan foto + GPS + catatan           │
│  │ foto, GPS, catatan   │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│        ┌────┴────┐                                                  │
│        ▼         ▼                                                  │
│  [Approve]    [Reject]                                              │
│        │         │                                                  │
│        ▼         ▼                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │ verifyReport(id)     │  │ rejectReport(id)     │                │
│  │ UPDATE status=       │  │ UPDATE status=       │                │
│  │ 'verified'           │  │ 'rejected'           │                │
│  └──────────┬───────────┘  └──────────────────────┘                │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ awardPoints(user,10) │  UPDATE users SET balance = balance+10    │
│  │ INSERT ke transaksi  │  INSERT INTO transactions (...)           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Flow: Load Peta + Marker

```
┌─────────────────────────────────────────────────────────────────────┐
│ LOAD PETA + MARKER                                                  │
│                                                                     │
│  [User buka peta]                                                   │
│        │                                                            │
│        ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ initMap()            │  L.map('map').setView([-6.2, 106.8], 13) │
│  │ → Leaflet map        │  L.tileLayer('tile.openstreetmap...')     │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ loadMarkers()        │  supabase.from('submissions')             │
│  │ → Query status=      │  .select('lat,lng,foto_url,catatan')     │
│  │   verified           │  .eq('status','verified')                │
│  └──────────┬───────────┘                                           │
│             │ [{lat, lng, foto_url, ...}]                           │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Untuk setiap record: │                                           │
│  │ 1. offsetGPS(lat,lng)│  Random 50-200m offset (privasi)          │
│  │ 2. L.marker([lat,lng])│  Buat marker di peta                    │
│  │ 3. Bind popup dgn    │  Klik marker → detail + thumbnail foto    │
│  │    detail + foto     │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Flow: Offline → Online Sync

```
┌──────────────────────────────────────────────┐
│ OFFLINE → ONLINE SYNC                        │
│                                              │
│  [User kirim laporan saat offline]           │
│        │                                     │
│        ▼                                     │
│  ┌──────────────────────┐                    │
│  │ Simpan ke            │  localStorage      │
│  │ localStorage         │  .setItem('pending │
│  │ (max 5)              │   _reports', [...])│
│  └──────────────────────┘                    │
│        │                                     │
│        ▼                                     │
│  window.addEventListener('online', () => {   │
│        │                                     │
│        ▼                                     │
│  ┌──────────────────────┐                    │
│  │ Ambil semua pending  │  localStorage      │
│  │ reports (FIFO)       │  .getItem()        │
│  └──────────┬───────────┘                    │
│             │                                │
│             ▼                                │
│  ┌──────────────────────┐                    │
│  │ Loop kirim satu per  │  submitReport()    │
│  │ satu + hapus dari    │  untuk setiap item │
│  │ localStorage         │                    │
│  └──────────────────────┘                    │
└──────────────────────────────────────────────┘
```

---

## 5. Flow: CI/CD Build APK

```
┌─────────────────────────────────────────────────────────────────────┐
│ CI/CD BUILD APK (GitHub Actions)                                    │
│                                                                     │
│  [git push main]  atau  [git tag v1.x.x]                            │
│        │                                                            │
│        ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ GitHub Actions       │  Trigger: .github/workflows/android-      │
│  │ workflow triggered   │  build.yml                               │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Setup JDK 17         │                                           │
│  │ + Android SDK        │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ npm ci               │  Install dependencies (dari lockfile)     │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ npx cap sync android │  Copy www/ → android/                     │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ ./gradlew            │                                           │
│  │ assembleDebug        │  Debug build (unsigned)                   │
│  │ ATAU                  │                                           │
│  │ assembleRelease      │  Release build (signed dgn keystore)      │
│  └──────────┬───────────┘                                           │
│             │                                                       │
│             ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ Upload APK ke        │  Tersedia di tab "Artifacts"              │
│  │ GitHub Artifacts     │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Update data flow setiap kali ada alur baru atau perubahan alur existing.*
