# Security Rules — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **ZERO TOLERANCE:** Aturan keamanan di bawah ini WAJIB diimplementasikan.
> Pelanggaran = bug keamanan.

---

## SR-001: Authentication
- Semua akses database HARUS melalui user yang sudah login (Supabase Auth)
- Token JWT disimpan di localStorage oleh Supabase client (otomatis)
- Session expired di-handle oleh Supabase Auth (default 1 jam)
- Refresh token otomatis oleh Supabase JS client

---

## SR-010: Row-Level Security (RLS) — WAJIB

Setiap tabel HARUS punya RLS policy. **TIDAK BOLEH** ada tabel tanpa RLS.

### Default Policy Template
```sql
-- Enable RLS
ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;

-- Policy: User lihat data sendiri
CREATE POLICY "Users can view own data"
ON nama_tabel FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admin lihat semua
CREATE POLICY "Admins can view all"
ON nama_tabel FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### Validation Rules per Tabel
| Tabel | Insert | Select | Update | Delete |
|-------|--------|--------|--------|--------|
| `users` | Trigger only | Self + Admin | Self (name, phone) + Admin (all) | Soft delete only |
| `submissions` | Informan only | Self + verified (all) + Admin (all) | Admin only | NO DELETE |
| `transactions` | Admin only | Self + Admin | NO UPDATE | NO DELETE |
| `missions` | Pedagang only | All logged in | Owner + Admin | Owner + Admin |

---

## SR-020: Input Validation (Client + Server)

### Client-side (JavaScript)
```javascript
// GPS validation
function isValidGPS(lat, lng) {
  return lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141;
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Filename sanitization
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
```

### Server-side (Supabase)
- Gunakan CHECK constraints di database
- Gunakan RLS policies untuk authorization
- Storage: restrict MIME type (hanya image/jpeg, image/png)

---

## SR-030: Supabase Keys

### JANGAN PERNAH commit key ke repository
```
# .gitignore (pastikan ada)
.env
.env.local
.env.production
```

### Key yang digunakan di client
```javascript
// www/index.html — ini AMAN (public key)
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...'; // ANON key = public key
```

- `SUPABASE_ANON_KEY` = **AMAN** untuk client (public key)
- RLS membatasi akses meskipun anon key bocor
- `SUPABASE_SERVICE_ROLE_KEY` = **RAHASIA** (admin bypass RLS) — jangan pernah di client

---

## SR-040: Storage Security

### Foto upload rules
```sql
-- Supabase Storage policy
CREATE POLICY "Anyone can upload photos (logged in)"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND bucket_id = 'photos'
  AND (storage.extension(name) = 'jpg'
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png')
  AND storage.foldername(name)[1] = 'public' -- hanya folder public
);
```

### Read access
```sql
-- Foto verified bisa diakses semua user (untuk peta)
-- Foto pending hanya admin + pemilik
```

---

## SR-050: XSS Prevention

### Escape semua user input sebelum render ke HTML
```javascript
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Pakai di mana pun user input ditampilkan
element.innerHTML = escapeHtml(userInput); // ✅ AMAN
element.innerHTML = userInput;             // ❌ XSS RISK!
```

---

## SR-060: CSRF / API Abuse

- Supabase Auth menggunakan token JWT → otomatis anti-CSRF
- Rate limiting di-handle Supabase (free tier: 200 req/jam untuk Auth)
- Client-side: debounce tombol submit (mencegah double-submit)

---

## SR-070: Data Privacy

- GPS laporan di-offset 50-200m sebelum ditampilkan di peta publik
- Foto informan tidak terlihat di peta publik (hanya thumbnail + catatan)
- Data user tidak dijual/dishare ke pihak ketiga
- Akun yang dihapus: data di-anonymize (name → 'Deleted User', email dihapus)

---

## SR-080: Build Security

- APK release HARUS signed dengan keystore yang sama
- Keystore file (.jks/.keystore) TIDAK BOLEH di-commit ke git
- Keystore disimpan di GitHub Secrets (base64 encoded)
- Password keystore di GitHub Secrets (tidak di file)

---

## SR-090: Dependency Security

- `npm audit` dijalankan setiap kali sebelum commit
- Library dari CDN diverifikasi checksum/subresource integrity
- Jangan tambah dependency baru tanpa review keamanan

---

*Update security rules setiap kali ada celah keamanan ditemukan.*
