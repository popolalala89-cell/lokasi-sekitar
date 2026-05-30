// ===== GLOBALS =====
var db = null;
var user = null;
var profile = null;
var myMap = null;
var markerLayer = null;
var prevScreen = null;
var SUPABASE_URL = 'https://dnpbyfpbbwkgsfwmzlva.supabase.co';
var SUPABASE_KEY = 'sb_publishable_XV71tP1dBZMyHg30p3aWIw_Phv5hbay';

// ===== INIT =====
function init() {
  if (typeof supabase !== 'undefined') {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    checkSession();
  } else {
    setTimeout(init, 500);
  }
}

async function checkSession() {
  try {
    var res = await db.auth.getSession();
    if (res.data.session) {
      user = res.data.session.user;
      var p = await db.from('profiles').select('*').eq('id', user.id).single();
      profile = p.data;
      goTo(profile.role);
    }
  } catch(e) {}
}

function goTo(screen) {
  prevScreen = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : null;
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(screen).classList.add('active');
  if (screen === 'admin') { document.getElementById('adminUser').textContent = profile ? profile.nama : ''; loadAdmin(); }
  if (screen === 'informan') document.getElementById('informanUser').textContent = profile ? profile.nama : '';
  if (screen === 'pedagang') document.getElementById('pedagangUser').textContent = profile ? profile.nama : '';
  if (screen === 'map') initMap();
}

function goBack() {
  if (prevScreen && document.getElementById(prevScreen)) goTo(prevScreen);
  else goTo(profile ? profile.role : 'login');
}

// ===== AUTH =====
async function doLogin() {
  var email = document.getElementById('loginEmail').value.trim();
  var pass = document.getElementById('loginPassword').value.trim();
  if (!email || !pass) { alert('Isi email dan password'); return; }
  var res = await db.auth.signInWithPassword({ email: email, password: pass });
  if (res.error) { alert('Gagal: ' + res.error.message); return; }
  user = res.data.user;
  var p = await db.from('profiles').select('*').eq('id', user.id).single();
  profile = p.data;
  goTo(profile.role);
}

async function doRegister() {
  var nama = document.getElementById('regNama').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var pass = document.getElementById('regPassword').value.trim();
  var role = document.getElementById('regRole').value;
  if (!nama || !email || !pass) { alert('Isi semua field'); return; }
  if (pass.length < 6) { alert('Password minimal 6 karakter'); return; }
  var res = await db.auth.signUp({ email: email, password: pass });
  if (res.error) { alert('Gagal: ' + res.error.message); return; }
  await db.from('profiles').update({ nama: nama, role: role }).eq('id', res.data.user.id);
  alert('✅ Registrasi berhasil! Silakan login.');
  goTo('login');
}

async function doLogout() {
  await db.auth.signOut();
  user = null; profile = null;
  goTo('login');
}

// ===== ADMIN =====
async function loadAdmin() {
  var l = await db.from('lokasi').select('id', { count: 'exact', head: true });
  var la = await db.from('lokasi').select('id', { count: 'exact', head: true }).eq('status', 'aktif');
  var u = await db.from('profiles').select('id', { count: 'exact', head: true });
  var lp = await db.from('lokasi').select('id', { count: 'exact', head: true }).eq('status', 'aktif');
  document.getElementById('sLokasi').textContent = l.count || 0;
  document.getElementById('sAktif').textContent = la.count || 0;
  document.getElementById('sUser').textContent = u.count || 0;
  document.getElementById('sPending').textContent = lp.count || 0;
  
  var pending = await db.from('lokasi').select('*, profiles(nama)').order('created_at', { ascending: false }).limit(30);
  var html = '';
  if (pending.data && pending.data.length > 0) {
    pending.data.forEach(function(loc) {
      var badge = '<span class="badge badge-' + loc.status + '">' + loc.status + '</span>';
      var fotoHtml = '';
      if (loc.foto_url && loc.foto_url.length > 0) {
        fotoHtml = '<div style="margin-top:4px;">';
        loc.foto_url.forEach(function(url) {
          fotoHtml += '<img src="' + url + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin:2px;" onclick="window.open(\\\'' + url + '\\\')">';
        });
        fotoHtml += '</div>';
      }
      html += '<div class="table-row">';
      html += '<div><b>' + (loc.deskripsi || 'Tanpa nama') + '</b>';
      if (loc.profiles) html += ' <small style="color:#888;">oleh ' + (loc.profiles.nama || '?') + '</small>';
      html += '<br><small>' + new Date(loc.created_at).toLocaleDateString('id-ID') + ' | ' + badge + '</small>';
      html += fotoHtml + '</div>';
      html += '<div style="display:flex;gap:4px;">';
      if (loc.status === 'aktif') html += '<button class="btn-sm btn-green" onclick="verifikasi(' + loc.id + ')">✅</button>';
      if (loc.status === 'aktif') html += '<button class="btn-sm btn-red" onclick="tolak(' + loc.id + ')">❌</button>';
      html += '<button class="btn-sm btn-red" onclick="hapusLok(' + loc.id + ')">🗑️</button>';
      html += '</div></div>';
    });
  } else {
    html = '<p style="text-align:center;color:#888;padding:20px;">Belum ada lokasi</p>';
  }
  document.getElementById('adminTable').innerHTML = html;
}

async function verifikasi(id) { await db.from('lokasi').update({ status: 'diverifikasi' }).eq('id', id); loadAdmin(); }
async function tolak(id) { await db.from('lokasi').update({ status: 'ditolak' }).eq('id', id); loadAdmin(); }
async function hapusLok(id) { if (confirm('Hapus permanen?')) { await db.from('lokasi').delete().eq('id', id); loadAdmin(); } }

// ===== INFORMAN =====
function shareLoc() { showLaporForm('cepat'); }
function laporkanDetail() { showLaporForm('detail'); }

function showLaporForm(mode) {
  document.getElementById('laporMode').textContent = mode === 'cepat' ? 'Laporan Cepat' : 'Laporan Detail';
  document.getElementById('laporMode').dataset.mode = mode;
  document.getElementById('laporDeskripsi').value = '';
  document.getElementById('laporKategori').value = '7';
  document.getElementById('laporPreview').innerHTML = '';
  goTo('lapor');
}

async function submitLaporan() {
  var mode = document.getElementById('laporMode').dataset.mode;
  var deskripsi = document.getElementById('laporDeskripsi').value.trim();
  var katId = document.getElementById('laporKategori').value;
  var fotoFiles = document.getElementById('laporFoto').files;
  
  if (mode === 'detail' && !deskripsi) { alert('Isi deskripsi PKL'); return; }
  
  document.getElementById('laporStatus').style.display = 'block';
  document.getElementById('laporStatus').textContent = '📡 Mengambil lokasi...';
  
  if (!navigator.geolocation) { alert('GPS tidak didukung'); goBack(); return; }
  
  navigator.geolocation.getCurrentPosition(async function(pos) {
    document.getElementById('laporStatus').textContent = '📤 Mengupload...';
    
    // Upload foto dulu
    var fotoUrls = [];
    if (fotoFiles && fotoFiles.length > 0) {
      for (var i = 0; i < Math.min(fotoFiles.length, 5); i++) {
        var file = fotoFiles[i];
        var fileName = user.id + '/' + Date.now() + '_' + i + '.' + file.name.split('.').pop();
        
        var uploadRes = await db.storage.from('pkl-photos').upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });
        
        if (!uploadRes.error) {
          var urlRes = db.storage.from('pkl-photos').getPublicUrl(fileName);
          fotoUrls.push(urlRes.data.publicUrl);
        }
      }
    }
    
    // Simpan lokasi
    var lokasiData = {
      user_id: user.id,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      deskripsi: deskripsi || 'PKL ditemukan',
      kategori_id: parseInt(katId),
      status: 'aktif'
    };
    
    if (fotoUrls.length > 0) lokasiData.foto_url = fotoUrls;
    
    var res = await db.from('lokasi').insert(lokasiData);
    
    document.getElementById('laporStatus').style.display = 'none';
    
    if (res.error) {
      alert('❌ Gagal: ' + res.error.message);
    } else {
      alert('✅ Laporan tersimpan! Terima kasih.');
    }
    goTo('informan');
  }, function(err) {
    document.getElementById('laporStatus').style.display = 'none';
    alert('❌ Gagal GPS: ' + err.message);
    goTo('informan');
  }, { enableHighAccuracy: true });
}

function previewFoto(input) {
  var preview = document.getElementById('laporPreview');
  preview.innerHTML = '';
  if (input.files) {
    for (var i = 0; i < Math.min(input.files.length, 5); i++) {
      var reader = new FileReader();
      reader.onload = (function(file) {
        return function(e) {
          var img = document.createElement('img');
          img.src = e.target.result;
          img.style.cssText = 'width:70px;height:70px;object-fit:cover;border-radius:8px;margin:4px;';
          preview.appendChild(img);
        };
      })(input.files[i]);
      reader.readAsDataURL(input.files[i]);
    }
  }
}

// ===== PEDAGANG =====
function daftarProduk() {
  var nama = prompt('Nama produk:');
  if (!nama) return;
  var harga = prompt('Harga (contoh: Rp 10.000):') || '';
  db.from('produk').insert({ user_id: user.id, nama_produk: nama, harga: harga }).then(function(res) {
    if (res.error) { alert('Gagal: ' + res.error.message); }
    else { alert('✅ Produk didaftarkan!'); }
  });
}

// ===== MAP =====
function initMap() {
  setTimeout(function() {
    var container = document.getElementById('mapContainer');
    if (myMap) { myMap.invalidateSize(); loadMarkers(); return; }
    L.Icon.Default.imagePath = 'lib/images/';
    myMap = L.map('mapContainer').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(myMap);
    markerLayer = L.layerGroup().addTo(myMap);
    loadMarkers();
  }, 300);
}

async function loadMarkers() {
  if (!myMap || !markerLayer) return;
  markerLayer.clearLayers();
  var res = await db.from('lokasi').select('*').in('status', ['aktif','diverifikasi']).order('created_at', { ascending: false });
  if (res.data && res.data.length > 0) {
    var bounds = [];
    res.data.forEach(function(loc) {
      var popupContent = '<b>📍 ' + (loc.deskripsi || 'PKL') + '</b><br><small>' + new Date(loc.created_at).toLocaleDateString('id-ID') + '</small><br><small>' + loc.status + '</small>';
      if (loc.foto_url && loc.foto_url.length > 0) {
        popupContent += '<br><img src="' + loc.foto_url[0] + '" style="width:150px;border-radius:8px;margin-top:4px;">';
      }
      var m = L.marker([loc.latitude, loc.longitude]).addTo(markerLayer);
      m.bindPopup(popupContent);
      bounds.push([loc.latitude, loc.longitude]);
    });
    myMap.fitBounds(bounds, { padding: [30, 30] });
  }
}
function refreshMap() { loadMarkers(); }
function centerMyLoc() {
  if (!myMap) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      myMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
      L.circleMarker([pos.coords.latitude, pos.coords.longitude], { radius: 8, color: '#FF6B35', fillColor: '#FF6B35', fillOpacity: 0.5 }).addTo(markerLayer).bindPopup('📍 Posisi kamu');
    });
  }
}

// Start
document.addEventListener('DOMContentLoaded', init);
