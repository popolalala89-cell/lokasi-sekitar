# Business Rules — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
> 
> **PENTING:** Aturan ini HARUS diimplementasikan dalam kode. Setiap rule harus bisa di-trace ke file/function.

---

## BR-001: Registrasi User
- User mendaftar dengan email + password (Supabase Auth)
- Saat register, pilih role: `informan` atau `pedagang`
- Role `admin` hanya bisa di-set manual dari Supabase dashboard
- Setiap email hanya boleh 1 akun
- **File:** `www/index.html` → form login/register

---

## BR-010: Pembuatan Misi
- Hanya user role `pedagang` yang bisa membuat misi
- Pedagang harus punya paket aktif + sisa kuota > 0
- 1 misi maksimal berdurasi 7 hari
- Budget poin per misi: min 10, max 100
- Misi otomatis closed saat kuota habis atau deadline tercapai
- **File:** (belum ada — fitur misi belum diimplementasi)

---

## BR-020: Pengiriman Laporan
- Hanya user role `informan` yang bisa mengirim laporan
- 1 laporan wajib punya: foto + GPS (lat, lng)
- GPS harus di Indonesia (lat: -11 s/d 6, lng: 95 s/d 141)
- Maksimal 10 laporan per informan per hari (anti-spam)
- Foto wajib < 10MB, format JPG/PNG
- Laporan masuk dengan status `pending`
- **File:** `www/index.html` → `submitReport()` function

---

## BR-030: Verifikasi Laporan
- Hanya admin yang bisa verifikasi/tolak laporan
- Verifikasi harus cek: foto valid (bukan hitam/fake), GPS masuk akal
- Status: `pending` → `verified` atau `rejected`
- Laporan verified: informan dapat +10 poin
- Laporan rejected: informan dapat notifikasi alasan (opsional)
- **File:** `www/index.html` → admin dashboard section

---

## BR-040: Sistem Poin
- 1 laporan verified = +10 poin (auto)
- Poin diberikan oleh sistem, bukan oleh pedagang
- Poin tidak bisa dipindahtangankan antar user
- Poin kadaluarsa setelah 12 bulan tidak aktif
- **File:** Supabase RLS + trigger (belum lengkap)

---

## BR-050: Paket Pedagang
- Tiga jenis paket: Harian (3 info), Mingguan (15 info), Bulanan (60 info)
- Paket HARUS dibayar dulu sebelum bisa digunakan
- Sisa kuota berkurang setiap kali pedagang melihat laporan
- Paket expired tidak bisa digunakan; kuota sisa hangus
- **File:** (belum ada — fitur payment belum diimplementasi)

---

## BR-060: Transaksi & Audit Trail
- Semua perubahan poin HARUS tercatat di tabel `transactions`
- Tidak boleh ada perubahan poin tanpa record transaksi
- Transaksi immutable — tidak bisa dihapus/diubah setelah dibuat
- **File:** Supabase trigger / backend

---

## BR-070: Peta & Privasi
- Hanya laporan `verified` yang muncul di peta publik
- Lokasi di peta di-offset random 50-200m (privasi PKL)
- Foto informan tidak ditampilkan di peta publik
- **File:** `www/index.html` → `loadMap()` function

---

## BR-080: Delete & Data Retention
- User bisa menghapus akun → data di-anonymize (soft delete)
- Laporan yang sudah verified tidak bisa dihapus
- Foto di storage dihapus setelah 90 hari laporan rejected
- **File:** (belum diimplementasi)

---

## BR-090: Anti-Abuse
- GPS di luar Indonesia → laporan otomatis ditolak
- Foto < 10KB (kemungkinan hitam/fake) → warning ke admin
- 5+ laporan dalam 1 jam dari user yang sama → cooldown 1 jam
- **File:** `www/index.html` → validasi client-side

---

## BR-100: Offline Mode
- Saat offline, laporan disimpan di localStorage
- Saat online kembali, kirim semua laporan tertunda (FIFO)
- Maksimal 5 laporan offline
- **File:** `www/index.html` → `isOnline` check

---

*Setiap penambahan rule baru HARUS di-review terhadap rule existing untuk conflict detection.*
