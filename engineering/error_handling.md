# Error Handling — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026

---

## Philosophy

> "Fail gracefully. Never show raw error to user. Always log for debugging."

---

## EH-001: Supabase Error Handling

### Pattern Wajib
```javascript
async function fetchData() {
  try {
    showLoading();
    const { data, error } = await supabase.from('table').select();

    if (error) {
      // Supabase error
      console.error('[fetchData] Supabase error:', error);
      showToast('Gagal memuat data. Silakan coba lagi.', 'error');
      return null;
    }

    return data;
  } catch (err) {
    // Network / unexpected error
    console.error('[fetchData] Unexpected error:', err);
    if (!navigator.onLine) {
      showToast('Tidak ada koneksi internet', 'warning');
    } else {
      showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
    return null;
  } finally {
    hideLoading();
  }
}
```

---

## EH-010: Error Levels

| Level | User Message | Log | Retry? |
|-------|-------------|-----|--------|
| **Network offline** | "Tidak ada koneksi internet" | console.warn | Yes (saat online) |
| **Supabase timeout** | "Server sedang sibuk, coba lagi" | console.error | Yes (3x, backoff) |
| **Validation failed** | "{{field}} tidak valid" | console.warn | No (perbaiki input) |
| **Auth expired** | "Sesi habis, silakan login ulang" | console.info | No (redirect login) |
| **Permission denied** | "Anda tidak punya akses" | console.warn | No |
| **Unknown error** | "Terjadi kesalahan" | console.error | Yes (1x) |

---

## EH-020: User-Facing Error Messages

### Aturan:
- **Bahasa Indonesia** — user Pa Popo adalah orang Indonesia
- **Jangan teknis** — jangan sebut "timeout", "500", "foreign key constraint"
- **Jangan salahkan user** — jangan "Anda salah input"
- **Kasih next step** — "Silakan coba lagi", "Periksa koneksi internet"

### Template:
```javascript
const ERROR_MESSAGES = {
  network: 'Tidak ada koneksi internet. Periksa WiFi atau data seluler.',
  server: 'Server sedang sibuk. Silakan coba lagi dalam beberapa saat.',
  auth: 'Sesi Anda telah berakhir. Silakan login kembali.',
  validation: {
    email: 'Format email tidak valid. Contoh: nama@email.com',
    password: 'Password minimal 6 karakter',
    gps: 'GPS harus berada di wilayah Indonesia',
    foto: 'Foto tidak boleh kosong. Silakan ambil foto terlebih dahulu.',
  },
  permission: 'Anda tidak memiliki akses ke fitur ini.',
  generic: 'Terjadi kesalahan. Silakan coba lagi atau hubungi admin.',
};
```

---

## EH-030: Retry Strategy

```javascript
async function withRetry(fn, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err; // last attempt → throw
      console.warn(`Retry ${i + 1}/${maxRetries} after error:`, err.message);
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i))); // exponential backoff
    }
  }
}

// Usage
await withRetry(() => supabase.from('submissions').select());
```

---

## EH-040: Offline Queue Error Recovery

```javascript
async function syncOfflineQueue() {
  const queue = JSON.parse(localStorage.getItem('pendingReports') || '[]');
  if (queue.length === 0) return;

  showToast(`Mengirim ${queue.length} laporan tertunda...`, 'info');

  let successCount = 0;
  const failedItems = [];

  for (const report of queue) {
    try {
      await submitReport(report);
      successCount++;
    } catch (err) {
      console.error('Sync error for report:', err);
      failedItems.push(report);
    }
  }

  // Simpan ulang yang gagal
  localStorage.setItem('pendingReports', JSON.stringify(failedItems));

  if (successCount > 0) {
    showToast(`${successCount} laporan berhasil terkirim!`, 'success');
  }
  if (failedItems.length > 0) {
    showToast(`${failedItems.length} laporan gagal. Akan dicoba lagi nanti.`, 'warning');
  }
}
```

---

## EH-050: Global Error Boundary

```javascript
// Tangkap unhandled errors
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
  // Jangan tampilkan ke user kecuali critical
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise]', event.reason);
  showToast('Terjadi kesalahan tak terduga', 'error');
});
```

---

## EH-060: Logging Strategy

```javascript
// Prefix konsisten untuk memudahkan debugging
const LOG_PREFIX = '[LokasiSekitar]';

function log(module, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = `${LOG_PREFIX}[${module}]`;
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

// Usage
log('Auth', 'Login berhasil', { userId: user.id });
log('Submission', 'Upload foto gagal', error);
```

---

*Update error handling setiap kali pattern error baru ditemukan.*
