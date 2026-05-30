# API Contract — Lokasi Sekitar

> **Versi:** 1.1 | **Terakhir diupdate:** 31 Mei 2026
>
> Kontrak antara WebView client dan Supabase backend. Semua query melalui Supabase JS client.
> **TIDAK ADA custom API server** — Supabase adalah API layer.

---

## Authentication (Supabase Auth)

```javascript
// Register
const r = await db.auth.signUp({ email, password });
// → auto-create profile via trigger handle_new_user()

// Login
const r = await db.auth.signInWithPassword({ email, password });

// Logout
await db.auth.signOut();

// Check session (auto-login)
const r = await db.auth.getSession();
```

---

## Database Queries

### Tabel: `profiles`

| Operation | Query | Access |
|-----------|-------|--------|
| Get my profile | `.from('profiles').select('*').eq('id', userId).single()` | Self |
| Update profile | `.from('profiles').update({nama, role}).eq('id', userId)` | Self (saat register) |
| Get profile names | `.from('profiles').select('id,nama').in('id', [...ids])` | Auth |
| Count users | `.from('profiles').select('id', {count:'exact', head:true})` | Admin |

### Tabel: `lokasi`

| Operation | Query | Access |
|-----------|-------|--------|
| Insert laporan | `.from('lokasi').insert({user_id, latitude, longitude, deskripsi, kategori_id, foto_url, status:'pending'})` | Auth (informan) |
| Get my reports | `.from('lokasi').select('*').eq('user_id', userId).order('created_at', false)` | Self |
| Get verified | `.from('lokasi').select('*').eq('status', 'diverifikasi').order('created_at', false)` | Auth (peta, pedagang) |
| Get pending | `.from('lokasi').select('*').order('created_at', false).limit(30)` | Admin (all) |
| Verify | `.from('lokasi').update({status:'diverifikasi'}).eq('id', id)` | Admin |
| Reject | `.from('lokasi').update({status:'ditolak'}).eq('id', id)` | Admin |
| Delete | `.from('lokasi').delete().eq('id', id)` | Admin |
| Count stats | `.from('lokasi').select('id',{count:'exact',head:true})` + filter status | Admin |

### Tabel: `produk`

| Operation | Query | Access |
|-----------|-------|--------|
| Get my produk | `.from('produk').select('*').eq('user_id', userId).order('created_at', false)` | Self |
| Insert | `.from('produk').insert({user_id, nama_produk, harga})` | Auth (pedagang) |
| Delete | `.from('produk').delete().eq('id', id)` | Self |

---

## Storage (Supabase Storage)

```javascript
// Upload foto
const up = await db.storage.from('pkl-photos').upload(fn, file, {contentType, upsert:false});

// Get public URL
const u = db.storage.from('pkl-photos').getPublicUrl(fn);
// → { data: { publicUrl: 'https://...' } }
```

---

## RPC (Stored Procedures)

```javascript
// Tambah poin user
await db.rpc('increment_poin', { uid: userId, amount: 10 });
```

---

## Error Format

```javascript
{ error: { message: '...', code: '...' }, data: null }
// Error handling:
if (r.error) { showToast('Gagal: ' + r.error.message, 'error'); return; }
```

---

*Update setiap kali query baru ditambahkan.*
