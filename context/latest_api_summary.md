# Latest API Summary — Lokasi Sekitar

> **Auto-generated:** 31 Mei 2026 | **Source:** `www/index.html` + Supabase queries
>
> ⚠️ RINGKASAN API queries yang digunakan di client. Untuk kontrak lengkap, lihat `engineering/api_contract.md`.
> Update setiap kali query baru ditambahkan.

---

## Supabase Client Init
```javascript
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## Auth Queries

| # | Function | File Location | Description |
|---|----------|---------------|-------------|
| A1 | `supabase.auth.signUp()` | `www/index.html` → register | Register email+password+role |
| A2 | `supabase.auth.signInWithPassword()` | `www/index.html` → login | Login |
| A3 | `supabase.auth.signOut()` | `www/index.html` → logout | Logout |
| A4 | `supabase.auth.getSession()` | `www/index.html` → checkSession | Auto-login check |

---

## Database Queries (Read)

| # | Query | Table | Filters | Used In |
|---|-------|-------|---------|---------|
| D1 | `.select('*').eq('id', userId).single()` | users | — | loadUserProfile |
| D2 | `.select('*')` | users | — | Admin: list users |
| D3 | `.select().eq('user_id', userId).order('created_at', false)` | submissions | user_id | loadMyReports |
| D4 | `.select().eq('status', 'verified').order('created_at', false)` | submissions | status=verified | loadMarkers (peta) |
| D5 | `.select('*, users(email,name)').eq('status', 'pending').order('created_at', false)` | submissions | status=pending + join users | Admin: loadPending |
| D6 | `.select().eq('user_id', userId).order('created_at', false)` | transactions | user_id | getTransactionHistory |

---

## Database Queries (Write)

| # | Mutation | Table | Data | Used In |
|---|----------|-------|------|---------|
| W1 | `.insert({foto_url, lat, lng, catatan, mission_id?})` | submissions | Laporan baru | submitReport |
| W2 | `.update({status: 'verified'}).eq('id', id)` | submissions | Admin approve | verifyReport |
| W3 | `.update({status: 'rejected'}).eq('id', id)` | submissions | Admin tolak | rejectReport |
| W4 | `.update({name, phone}).eq('id', userId)` | users | Update profile | updateProfile |

---

## Storage Queries

| # | Operation | Bucket | Used In |
|---|-----------|--------|---------|
| S1 | `.upload(fileName, base64Data)` | photos | submitReport |
| S2 | `.getPublicUrl(path)` | photos | submitReport |

---

## Realtime Queries (COMING SOON)

Belum diimplementasikan. Rencana:
- Subscribe ke INSERT submissions (notifikasi admin)
- Subscribe ke UPDATE submissions (status berubah)

---

## Query yang Belum Ada (Need to Implement)

| # | Kebutuhan | Rencana |
|---|-----------|---------|
| N1 | Insert missions | v2.1 |
| N2 | Select active missions | v2.1 |
| N3 | Update mission status | v2.1 |
| N4 | Insert packages | v2.1 |
| N5 | Select active packages | v2.1 |
| N6 | Update quota_used | v2.1 |

---

*Update setelah setiap perubahan query di kode.*
