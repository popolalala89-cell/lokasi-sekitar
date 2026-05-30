# Performance Rules — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| App cold start | < 3 detik | Dari tap icon → dashboard muncul |
| App warm start | < 1 detik | Dari background → resume |
| Foto capture + upload | < 10 detik | Tap kamera → upload selesai |
| Peta load (50 marker) | < 2 detik | Buka tab peta → marker muncul |
| APK size | < 10 MB | File .apk size |
| Memory usage | < 100 MB | Di HP mid-range (3GB RAM) |
| Network payload | < 500 KB per screen | Data yang di-fetch per halaman |

---

## PR-001: Minimal Dependencies

- **Jangan tambah library** kecuali benar-benar diperlukan
- Library yang ada: Supabase JS SDK (1 file), Leaflet.js (1 file)
- Semua CSS inline — tidak ada framework CSS
- Semua JS vanilla — tidak ada framework JS
- Hasil: APK ringan, loading cepat, no build step

---

## PR-010: Asset Optimization

### Gambar
```html
<!-- ✅ BENAR: Thumbnail untuk list/peta -->
<img src="foto.jpg" width="150" height="150" loading="lazy" alt="...">

<!-- ❌ ⚠️ JANGAN pakai loading="lazy" di Capacitor WebView Android -->
<!-- Selalu merusak layout! Gunakan CSS .thumb 50x50 saja -->
```

**Aturan Gambar (dari memory project):**
- **JANGAN** pakai `loading="lazy"` di img tag — selalu merusak layout di Capacitor WebView Android
- Gunakan CSS `.thumb` dengan dimensi 50x50px
- Kompresi foto client-side sebelum upload (max 1024px width)
- Format: JPEG quality 70% untuk foto laporan

### JavaScript
- Semua JS dalam 1 file (`www/index.html`)
- Tidak ada minification (premature optimization)
- Tidak ada build step (webpack/vite) — keep simple

---

## PR-020: Network Optimization

### Data Fetching
```javascript
// ✅ BENAR: Select kolom spesifik, bukan *
const { data } = await supabase
  .from('submissions')
  .select('id, lat, lng, foto_url, catatan, created_at') // spesifik
  .eq('status', 'verified')
  .limit(50); // batasi jumlah

// ❌ SALAH: Select semua + tanpa limit
const { data } = await supabase.from('submissions').select('*');
```

### Caching
```javascript
// Simple in-memory cache (reset saat page refresh)
const cache = {
  verifiedReports: null,
  lastFetch: null,
  CACHE_TTL: 30000, // 30 detik
};

async function getVerifiedReports() {
  if (cache.verifiedReports && Date.now() - cache.lastFetch < cache.CACHE_TTL) {
    return cache.verifiedReports; // return cached
  }
  const { data } = await supabase.from('submissions').select().eq('status', 'verified');
  cache.verifiedReports = data;
  cache.lastFetch = Date.now();
  return data;
}
```

---

## PR-030: Render Optimization

### Peta (Leaflet)
- Batasi marker yang dirender: max 200 marker
- Jika > 200 marker, gunakan cluster (Leaflet.markercluster — coming soon)
- Tile peta di-cache browser otomatis

### List/Table
- Jika > 100 item, gunakan virtual scroll (sederhana: render 20 pertama, lazy load sisanya)
- Jangan render semua laporan sekaligus

---

## PR-040: Event Listener Optimization

```javascript
// ✅ BENAR: Debounce untuk event yang sering dipicu
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: resize, scroll, input search
window.addEventListener('resize', debounce(handleResize, 200));
searchInput.addEventListener('input', debounce(handleSearch, 300));
```

---

## PR-050: Memory Management

- Hapus event listener saat section disembunyikan
- Kosongkan cache saat logout
- Jangan simpan base64 foto besar di memori — upload langsung, hapus dari memori

```javascript
function handleLogout() {
  // Clear cache
  cache.verifiedReports = null;
  // Clear localStorage (kecuali offline queue)
  const pending = localStorage.getItem('pendingReports');
  localStorage.clear();
  if (pending) localStorage.setItem('pendingReports', pending);
  // Sign out
  supabase.auth.signOut();
}
```

---

## PR-060: APK Size Budget

| Komponen | Budget |
|----------|--------|
| Capacitor runtime | ~3 MB |
| WebView (www/) | ~1 MB |
| Plugins (camera, geo, filesystem) | ~2 MB |
| Gradle + Android support | ~3 MB |
| **TOTAL** | **< 10 MB** |

**Cara cek:** Download APK dari CI artifacts → lihat size.

---

## PR-070: Performance Testing (Manual)

Karena tidak ada automated testing, lakukan manual check:
1. Install APK di HP mid-range (3GB RAM, Android 8+)
2. Cold start: tap icon → hitung sampai dashboard muncul
3. Ambil foto → upload → hitung sampai toast sukses
4. Buka peta → scroll → cek apakah marker muncul tanpa lag
5. Offline mode: matikan internet → kirim laporan → nyalakan internet → cek sync

---

*Update performance rules setelah setiap profiling/testing.*
