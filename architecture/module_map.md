# Module Map — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> Mapping setiap modul ke file/function. Update setiap kali modul baru ditambahkan.

---

## Module Structure (Single-File SPA)

Karena aplikasi menggunakan **single HTML file** (`www/index.html`), "module" berarti **grup fungsi** dalam file yang sama. Rencana ke depan: jika file > 3000 baris, split jadi beberapa file JS.

```
www/index.html
│
├── 🔐 AUTH MODULE
│   ├── initSupabase()          → Inisialisasi Supabase client
│   ├── checkSession()          → Cek session existing (auto-login)
│   ├── handleLogin()           → Login email+password
│   ├── handleRegister()        → Register + pilih role
│   ├── handleLogout()          → Clear session
│   └── getCurrentUser()        → Return user object
│
├── 👤 USER MODULE
│   ├── showDashboard()         → Tampilkan view sesuai role
│   ├── loadUserProfile()       → Load data user dari DB
│   ├── updateProfile()         → Edit data user
│   └── deleteAccount()         → Soft-delete account
│
├── 📸 SUBMISSION MODULE
│   ├── openCamera()            → Buka kamera via Capacitor
│   ├── getGPS()                → Dapatkan koordinat via Capacitor
│   ├── validateGPS(lat, lng)   → Cek GPS dalam range Indonesia
│   ├── submitReport()          → Upload foto + insert ke DB
│   ├── loadMyReports()         → Load riwayat laporan user
│   └── isOnline()              → Deteksi koneksi internet
│
├── ✅ VERIFICATION MODULE (ADMIN)
│   ├── loadPendingReports()    → Load laporan status pending
│   ├── verifyReport(id)        → Approve laporan (+10 poin)
│   ├── rejectReport(id)        → Tolak laporan
│   └── bulkVerify(ids)         → Bulk approve (coming soon)
│
├── 🗺️ MAP MODULE
│   ├── initMap()               → Inisialisasi Leaflet map
│   ├── loadMarkers()           → Tampilkan marker laporan verified
│   ├── offsetGPS(lat, lng)     → Random offset 50-200m (privasi)
│   └── flyToLocation(lat, lng) → Animasi pindah peta
│
├── 💰 POINTS & TRANSACTIONS MODULE
│   ├── getMyPoints()           → Load poin user
│   ├── getTransactionHistory() → Load riwayat transaksi
│   └── awardPoints(userId, n)  → Tambah poin (admin only)
│
├── 🎯 MISSION MODULE (COMING SOON)
│   ├── createMission()         → Buat misi (pedagang)
│   ├── loadActiveMissions()    → Load misi aktif
│   ├── assignToMission()       → Kaitkan laporan ke misi
│   └── closeMission()          → Tutup misi
│
├── 💳 PAYMENT MODULE (COMING SOON)
│   ├── buyPackage()            → Beli paket
│   ├── getActivePackage()      → Cek paket aktif
│   └── getRemainingQuota()     → Sisa kuota info
│
└── 🧰 UTILITY MODULE
    ├── showToast(msg, type)    → Tampilkan toast/alert
    ├── formatDate(date)        → Format tanggal (ID locale)
    ├── showLoading() / hideLoading()
    └── handleError(err)        → Global error handler
```

---

## Database ↔ Module Mapping

| Supabase Table | Module yang Baca/Tulis |
|----------------|------------------------|
| `users` | Auth, User |
| `submissions` | Submission, Verification, Map |
| `missions` | Mission (coming soon) |
| `transactions` | Points & Transactions |
| `packages` | Payment (coming soon) |

---

## UI Sections (dalam index.html)

```
┌────────────────────────────────────┐
│ #app-container                     │
│                                    │
│  #auth-section (login/register)    │
│  #dashboard-section                │
│    ├── #admin-view                 │
│    ├── #informan-view              │
│    └── #pedagang-view              │
│  #camera-section (popup)           │
│  #report-detail-section (popup)    │
│  #map-section (fullscreen)         │
└────────────────────────────────────┘
```

---

*Update module map setelah setiap fitur baru diimplementasikan.*
