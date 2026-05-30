# Coding Rules — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **GOLDEN RULE:** AI agent WAJIB membaca file ini sebelum menulis atau mengubah kode apa pun.

---

## CR-001: Bahasa & Encoding
- Kode ditulis dalam **Bahasa Indonesia** untuk komentar, **English** untuk nama variabel/fungsi
- Encoding: UTF-8
- Indentasi: 2 spasi (bukan tab)
- Akhiran baris: LF (\\n)

---

## CR-010: Naming Convention

| Item | Convention | Contoh |
|------|-----------|--------|
| Variabel | camelCase | `userRole`, `pendingReports` |
| Fungsi | camelCase | `submitReport()`, `loadMap()` |
| Konstanta | UPPER_SNAKE | `MAX_OFFLINE_REPORTS`, `API_URL` |
| CSS class | kebab-case | `.report-card`, `.admin-panel` |
| HTML id | kebab-case | `admin-view`, `report-detail` |
| Database kolom | snake_case | `user_id`, `created_at` |
| Database tabel | snake_case (plural) | `submissions`, `transactions` |

---

## CR-020: Struktur File

### Single HTML File (`www/index.html`)
```
<!DOCTYPE html>
<html>
<head>
  <!-- Meta, title, styles -->
</head>
<body>
  <!-- HTML structure -->
  <script>
    // Semua JavaScript di sini
  </script>
</body>
</html>
```

### Urutan JavaScript dalam `<script>`:
1. Konstanta & konfigurasi
2. Inisialisasi (Supabase, Leaflet, Capacitor plugins)
3. Auth functions
4. UI/DOM functions
5. Business logic functions
6. Event listeners
7. Initial load / bootstrap

---

## CR-030: Supabase Query Rules

```javascript
// ✅ BENAR: Gunakan Supabase client, bukan raw fetch
const { data, error } = await supabase
  .from('submissions')
  .select('*, users(name)')
  .eq('status', 'verified')
  .order('created_at', { ascending: false });

// ❌ SALAH: Jangan fetch langsung ke REST endpoint
const res = await fetch('https://xxx.supabase.co/rest/v1/submissions');

// ✅ Error handling WAJIB
if (error) {
  console.error('Query error:', error);
  showToast('Gagal memuat data', 'error');
  return;
}
```

---

## CR-040: DOM Manipulation Rules

```javascript
// ✅ BENAR: Gunakan querySelector dengan ID spesifik
const adminView = document.querySelector('#admin-view');
adminView.style.display = 'block';

// ✅ BENAR: innerHTML hanya untuk konten yang sudah disanitasi
card.innerHTML = `<div>${escapeHtml(userInput)}</div>`;

// ❌ SALAH: Jangan taruh user input langsung ke innerHTML
card.innerHTML = `<div>${userInput}</div>`; // XSS risk!

// ✅ BENAR: Escape HTML manual
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

---

## CR-050: Async/Await Rules

```javascript
// ✅ BENAR: Async function dengan try/catch
async function loadReports() {
  try {
    const { data, error } = await supabase.from('submissions').select();
    if (error) throw error;
    renderReports(data);
  } catch (err) {
    handleError(err);
  }
}

// ❌ SALAH: Jangan pake .then() chaining
supabase.from('submissions').select().then(data => ...).catch(...);

// ✅ BENAR: IIFE untuk top-level async
(async function() {
  await checkSession();
})();
```

---

## CR-060: CSS Rules

- Semua CSS di dalam `<style>` tag (tidak ada file terpisah)
- Mobile-first: desain untuk layar kecil dulu, baru tambah media query untuk tablet
- Gunakan unit `rem`/`em` untuk font, `%`/`vh`/`vw` untuk layout
- Jangan pakai `!important` kecuali benar-benar terpaksa
- Warna di-hardcode — tidak ada CSS variables (keep simple)
- Touch target minimal 48x48px

---

## CR-070: Keamanan Client-Side

```javascript
// ✅ BENAR: Validasi SEMUA user input
function validateGPS(lat, lng) {
  if (lat < -11 || lat > 6 || lng < 95 || lng > 141) {
    showToast('GPS di luar wilayah Indonesia', 'error');
    return false;
  }
  return true;
}

// ✅ BENAR: Sanitasi sebelum render
function renderUserContent(text) {
  return escapeHtml(text);
}

// ❌ SALAH: Jangan percaya client-side validation saja
// Semua aturan keamanan harus ada di RLS Supabase juga
```

---

## CR-080: Offline-First Rules

```javascript
// Cek koneksi sebelum operasi network
async function safeSubmit(data) {
  if (!navigator.onLine) {
    saveToOfflineQueue(data);
    showToast('Disimpan offline. Terkirim saat online.', 'info');
    return;
  }
  await submitReport(data);
}

// Jangan gunakan alert() — pakai showToast() custom
```

---

## CR-090: Performance Rules

- Jangan load library yang tidak dipakai
- Gambar dari Supabase Storage: gunakan thumbnail (transform URL) jika tersedia
- Debounce event listener yang sering (scroll, resize, input)
- Jangan query ulang data yang sudah ada di memori; gunakan cache sederhana

---

## CR-100: Git Rules

```
Branch naming:
  main              → production-ready code
  feature/nama      → fitur baru
  fix/nama          → bug fix
  docs/nama         → dokumentasi
  refactor/nama     → refactor tanpa ubah behavior

Commit message format:
  feat: deskripsi singkat (bahasa Indonesia)
  fix: deskripsi singkat
  docs: deskripsi singkat
  refactor: deskripsi singkat
  chore: deskripsi singkat
```

---

*Pelanggaran aturan coding = code review ditolak.*
