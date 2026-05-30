// ========================================
// LOKASI SEKITAR - Full Stack App
// Supabase + Capacitor + Leaflet
// ========================================

// Supabase Config
const SUPABASE_URL = 'https://dnpbyfpbbwkgsfwmzlva.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XV71tP1dBZMyHg30p3aWIw_Phv5hbay';

let supabase = null;
let currentUser = null;
let currentProfile = null;
let currentMap = null;
let markerLayer = null;

// ========================================
// INIT
// ========================================

function initApp() {
  document.getElementById('loginScreen').classList.add('active');
  
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    checkAuth();
  } else {
    document.querySelector('#loginScreen .auth-card').innerHTML = 
      '<h2>⚠️ Gagal</h2><p style="text-align:center;color:#888;">Tidak bisa muat library.<br>Coba restart aplikasi.</p>';
  }
}

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadProfile();
    showRoleScreen();
  } else {
    showScreen('loginScreen');
  }
}

async function loadProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  currentProfile = data;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  if (screenId === 'adminScreen') loadAdminDashboard();
  if (screenId === 'informanScreen') loadInformanHome();
  if (screenId === 'pedagangScreen') loadPedagangHome();
  if (screenId === 'mapScreen') initMap();
}

function showRoleScreen() {
  if (!currentProfile) {
    showScreen('loginScreen');
    return;
  }
  showScreen(currentProfile.role + 'Screen');
}

// ========================================
// AUTH
// ========================================

async function register() {
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const nama = document.getElementById('regNama').value.trim();
  const role = document.getElementById('regRole').value;
  
  if (!email || !password || !nama) {
    alert('Mohon isi semua field');
    return;
  }
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) { alert('Error: ' + error.message); return; }
  
  // Update profile nama + role
  await supabase.from('profiles').update({ nama, role }).eq('id', data.user.id);
  
  alert('✅ Registrasi berhasil! Silakan login.');
  showScreen('loginScreen');
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { alert('Error: ' + error.message); return; }
  
  currentUser = data.user;
  await loadProfile();
  showRoleScreen();
}

async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  currentProfile = null;
  showScreen('loginScreen');
}

// ========================================
// ADMIN SCREEN
// ========================================

async function loadAdminDashboard() {
  document.getElementById('adminNama').textContent = currentProfile.nama || currentUser.email;
  
  // Load stats
  const { data: lokasi } = await supabase.from('lokasi').select('id, status');
  const { data: laporan } = await supabase.from('laporan').select('id');
  const { data: users } = await supabase.from('profiles').select('role');
  
  const totalLokasi = lokasi.length;
  const lokasiAktif = lokasi.filter(l => l.status === 'aktif').length;
  const totalLaporan = laporan.length;
  const totalUser = users.length;
  
  document.getElementById('statLokasi').textContent = totalLokasi;
  document.getElementById('statAktif').textContent = lokasiAktif;
  document.getElementById('statLaporan').textContent = totalLaporan;
  document.getElementById('statUser').textContent = totalUser;
  
  // Load pending verifications
  const { data: pending } = await supabase
    .from('lokasi')
    .select('*')
    .eq('status', 'aktif')
    .order('created_at', { ascending: false })
    .limit(20);
  
  renderAdminTable(pending);
}

function renderAdminTable(locations) {
  const tbody = document.getElementById('adminTableBody');
  if (locations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:#888;">Belum ada lokasi</td></tr>';
    return;
  }
  
  tbody.innerHTML = locations.map(l => `
    <tr>
      <td>${new Date(l.created_at).toLocaleDateString('id-ID')}</td>
      <td>${l.deskripsi || l.nama_pedagang || 'Tanpa nama'}</td>
      <td><span class="badge badge-${l.status}">${l.status}</span></td>
      <td>
        <button class="btn-mini btn-success" onclick="verifikasiLokasi(${l.id})">✅</button>
        <button class="btn-mini btn-danger" onclick="tolakLokasi(${l.id})">❌</button>
        <button class="btn-mini btn-info" onclick="hapusLokasi(${l.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

async function verifikasiLokasi(id) {
  await supabase.from('lokasi').update({ status: 'diverifikasi' }).eq('id', id);
  loadAdminDashboard();
}

async function tolakLokasi(id) {
  await supabase.from('lokasi').update({ status: 'ditolak' }).eq('id', id);
  loadAdminDashboard();
}

async function hapusLokasi(id) {
  if (!confirm('Yakin hapus lokasi ini?')) return;
  await supabase.from('lokasi').delete().eq('id', id);
  loadAdminDashboard();
}

function manageUsers() {
  alert('Fitur kelola user akan ditambahkan segera');
}

function exportAllData() {
  alert('Fitur export data akan ditambahkan segera');
}

// ========================================
// INFORMAN SCREEN
// ========================================

function loadInformanHome() {
  document.getElementById('informanNama').textContent = currentProfile.nama || currentUser.email;
}

async function shareLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    document.getElementById('informanStatus').textContent = 'Menyimpan...';
    
    const { error } = await supabase.from('lokasi').insert({
      user_id: currentUser.id,
      latitude: lat,
      longitude: lng,
      status: 'aktif',
      deskripsi: 'PKL ditemukan oleh informan'
    });
    
    if (error) {
      document.getElementById('informanStatus').textContent = '❌ Gagal: ' + error.message;
    } else {
      document.getElementById('informanStatus').textContent = '✅ Lokasi PKL tersimpan!';
      
      // Refresh map if visible
      if (document.getElementById('mapScreen').classList.contains('active')) {
        loadMapMarkers();
      }
      
      setTimeout(() => {
        document.getElementById('informanStatus').textContent = 'Siap melaporkan PKL';
      }, 3000);
    }
  }, (error) => {
    document.getElementById('informanStatus').textContent = '❌ ' + error.message;
  });
}

async function laporkanDenganDetail() {
  const deskripsi = prompt('Deskripsi PKL (nama pedagang, jualan apa, dll):');
  if (!deskripsi) return;
  
  const kategoriPilih = prompt('Kategori: 1.🍜Makanan 2.🧋Minuman 3.🥬Sayur 4.👗Pakaian 5.💍Aksesoris 6.📱Elektronik 7.📍Lainnya\nPilih nomor:');
  let kategoriId = 7;
  if (kategoriPilih >= 1 && kategoriPilih <= 7) kategoriId = parseInt(kategoriPilih);
  
  if (!navigator.geolocation) { alert('Geolocation tidak didukung'); return; }
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { error } = await supabase.from('lokasi').insert({
      user_id: currentUser.id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      deskripsi,
      kategori_id: kategoriId,
      status: 'aktif'
    });
    
    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      alert('✅ Laporan berhasil disimpan!');
    }
  });
}

// ========================================
// PEDAGANG SCREEN
// ========================================

function loadPedagangHome() {
  document.getElementById('pedagangNama').textContent = currentProfile.nama || currentUser.email;
}

async function daftarDagangan() {
  const nama = prompt('Nama jualan/dagangan:');
  if (!nama) return;
  const harga = prompt('Harga (contoh: Rp 10.000):') || '';
  
  const { error } = await supabase.from('produk').insert({
    user_id: currentUser.id,
    nama_produk: nama,
    harga: harga
  });
  
  if (error) {
    alert('Gagal: ' + error.message);
  } else {
    alert('✅ Dagangan berhasil didaftarkan!');
  }
}

// ========================================
// MAP SCREEN (shared)
// ========================================

function initMap() {
  if (currentMap) { currentMap.invalidateSize(); return; }
  
  currentMap = L.map('map').setView([-6.2, 106.8], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(currentMap);
  
  markerLayer = L.layerGroup().addTo(currentMap);
  loadMapMarkers();
}

async function loadMapMarkers() {
  if (!currentMap || !markerLayer) return;
  
  markerLayer.clearLayers();
  
  const { data: locations } = await supabase
    .from('lokasi')
    .select('*')
    .in('status', ['aktif', 'diverifikasi'])
    .order('created_at', { ascending: false });
  
  if (locations && locations.length > 0) {
    const bounds = [];
    locations.forEach(loc => {
      const marker = L.marker([loc.latitude, loc.longitude])
        .addTo(markerLayer)
        .bindPopup(`
          <b>📍 ${loc.deskripsi || 'PKL'}</b><br>
          <small>${new Date(loc.created_at).toLocaleDateString('id-ID')}</small><br>
          <small>Status: ${loc.status}</small>
        `);
      bounds.push([loc.latitude, loc.longitude]);
    });
    currentMap.fitBounds(bounds, { padding: [30, 30] });
  }
}

function centerMap() {
  if (!currentMap) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      currentMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
    });
  }
}

// ========================================
// START
// ========================================

document.addEventListener('DOMContentLoaded', initApp);
