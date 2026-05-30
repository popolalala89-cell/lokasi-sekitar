# Business Vision — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026 | **Author:** Pa Popo

---

## Ringkasan Eksekutif

**Lokasi Sekitar** adalah aplikasi mobile crowdsourcing informasi lokasi Pedagang Kaki Lima (PKL).
Aplikasi menjembatani **Informan** (pemburu lokasi) dengan **Pedagang** (penerima info),
difasilitasi oleh **Admin** yang melakukan verifikasi dan moderasi.

**Value Proposition:**
- **Untuk Pedagang:** Akses real-time ke lokasi PKL ramai tanpa harus survei sendiri. Hemat waktu & bensin.
- **Untuk Informan:** Penghasilan tambahan via poin/reward dari setiap laporan lokasi yang diverifikasi.
- **Untuk Admin:** Dashboard moderasi + monetisasi via sistem poin dan paket berbayar.

---

## Model Bisnis

### Alur Transaksi
```
Pedagang beli paket → Buka misi → Informan kirim laporan → Admin verifikasi
→ Pedagang lihat + beri poin → Informan kumpulkan poin → Konversi poin ke saldo
```

### Revenue Stream
| Paket | Harga | Kuota Info | Target |
|-------|-------|------------|--------|
| Harian | Rp 10rb | 3 info/hari | PKL kecil |
| Mingguan | Rp 50rb | 15 info/minggu | PKL menengah |
| Bulanan | Rp 150rb | 60 info/bulan | Pedagang tetap + COD |

### Split Revenue
- 70% → Pool poin informan
- 30% → Platform (admin)

---

## Visi Produk

Menjadi **platform crowdsourcing lokasi PKL nomor 1 di Indonesia** yang memberdayakan
pedagang kecil dan masyarakat sekitar secara berkelanjutan.

### Target 12 Bulan Pertama
1. **Q1:** MVP stabil di 1 kota — 50 pedagang aktif, 100 informan
2. **Q2:** 3 kota — payment otomatis via QRIS/midtrans
3. **Q3:** 10 kota — gamifikasi leaderboard + referral
4. **Q4:** Nasional — AI auto-verifikasi foto + GPS

---

## Segmentasi Pengguna

1. **Pedagang Kaki Lima (PKL)**
   - Penjual keliling, food truck, penjual musiman
   - Butuh info lokasi ramai dengan cepat
   - Anggaran terbatas → paket harian/mingguan

2. **Informan**
   - Mahasiswa, ojol, ibu rumah tangga, pengangguran
   - Cari penghasilan tambahan fleksibel
   - Punya HP Android + kamera + GPS

3. **Admin**
   - Verifikasi laporan (foto + GPS + timestamp)
   - Kelola user, paket, transaksi, poin

---

## Prinsip Desain

1. **Mobile-First** — Aplikasi diakses via Android APK, dibangun dengan Capacitor
2. **Offline-Tolerant** — Laporan bisa disimpan lokal, kirim saat online
3. **Ringan** — APK < 10MB, loading < 3 detik
4. **Simpel** — Kurva belajar 0 menit; 1 layar = 1 aksi utama
5. **Transparan** — Poin, transaksi, status terlihat jelas

---

## Batasan & Risiko

- **Device:** Android 8+ (API 26+)
- **Koneksi:** Butuh internet untuk sync; offline support terbatas
- **Build:** Dikembangkan di Termux Android + build via GitHub Actions (tidak ada Android Studio lokal)
- **Keamanan:** Foto + GPS adalah data sensitif — enkripsi di storage

---

*Dokumen ini adalah sumber kebenaran (source of truth) untuk keputusan produk.*
*Setiap perubahan HARUS tercatat di DECISIONS.md.*
