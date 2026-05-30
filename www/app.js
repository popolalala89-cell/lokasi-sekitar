// ===== GLOBALS =====
var db, user, profile, myMap, markerLayer, prevScreen;
var SUPABASE_URL = 'https://dnpbyfpbbwkgsfwmzlva.supabase.co';
var SUPABASE_KEY = 'sb_publishable_XV71tP1dBZMyHg30p3aWIw_Phv5hbay';

// ===== INIT =====
function init() {
  if (typeof supabase !== 'undefined') { db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); checkSession(); }
  else setTimeout(init, 500);
}

async function checkSession() {
  try {
    var r = await db.auth.getSession();
    if (r.data.session) { user = r.data.session.user; await loadProfile(); goTo(profile.role); }
  } catch(e) {}
}

async function loadProfile() {
  var p = await db.from('profiles').select('*').eq('id', user.id).single();
  profile = p.data;
}

function goTo(s) {
  prevScreen = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : null;
  document.querySelectorAll('.screen').forEach(function(x) { x.classList.remove('active'); });
  var el = document.getElementById(s);
  if (el) el.classList.add('active');
  else { console.log('Screen not found: ' + s); return; }
  
  if (s === 'admin') { document.getElementById('adminUser').textContent = profile ? profile.nama : ''; loadAdmin(); }
  if (s === 'informan') { document.getElementById('informanUser').textContent = profile ? profile.nama : ''; document.getElementById('informanPoin').textContent = (profile ? profile.poin || 0 : 0) + ' ⭐'; }
  if (s === 'pedagang') { document.getElementById('pedagangUser').textContent = profile ? profile.nama : ''; }
  if (s === 'histori') loadHistori();
  if (s === 'daganganSaya') loadDaganganSaya();
  if (s === 'mapView') initMap();
}

function goBack() {
  if (prevScreen && document.getElementById(prevScreen)) goTo(prevScreen);
  else goTo(profile ? profile.role : 'login');
}

// ===== AUTH =====
async function doLogin() {
  var e = document.getElementById('loginEmail').value.trim(), p = document.getElementById('loginPassword').value.trim();
  if (!e || !p) { alert('Isi email dan password'); return; }
  var r = await db.auth.signInWithPassword({ email: e, password: p });
  if (r.error) { alert('Gagal: ' + r.error.message); return; }
  user = r.data.user; await loadProfile(); goTo(profile.role);
}

async function doRegister() {
  var n = document.getElementById('regNama').value.trim(), e = document.getElementById('regEmail').value.trim();
  var p = document.getElementById('regPassword').value.trim(), rl = document.getElementById('regRole').value;
  if (!n || !e || !p) { alert('Isi semua field'); return; }
  if (p.length < 6) { alert('Password minimal 6 karakter'); return; }
  var r = await db.auth.signUp({ email: e, password: p });
  if (r.error) { alert('Gagal: ' + r.error.message); return; }
  await db.from('profiles').update({ nama: n, role: rl }).eq('id', r.data.user.id);
  alert('✅ Registrasi berhasil! Silakan login.'); goTo('login');
}

async function doLogout() { await db.auth.signOut(); user = null; profile = null; goTo('login'); }

// ===== ADMIN =====
async function loadAdmin() {
  var l = await db.from('lokasi').select('id',{count:'exact',head:true});
  var la = await db.from('lokasi').select('id',{count:'exact',head:true}).eq('status','aktif');
  var u = await db.from('profiles').select('id',{count:'exact',head:true});
  document.getElementById('sLokasi').textContent = l.count||0;
  document.getElementById('sAktif').textContent = la.count||0;
  document.getElementById('sUser').textContent = u.count||0;
  document.getElementById('sPending').textContent = la.count||0;
  
  var d = await db.from('lokasi').select('*,profiles(nama)').order('created_at',{ascending:false}).limit(30);
  var h = '';
  if (d.data && d.data.length > 0) {
    d.data.forEach(function(loc) {
      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':loc.status==='ditolak'?'r':'y') + '">'+loc.status+'</span>';
      var f = '';
      if (loc.foto_url && loc.foto_url.length > 0) loc.foto_url.forEach(function(u) { f += '<img src="'+u+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')">'; });
      h += '<div class="row"><div><b>'+(loc.deskripsi||'Tanpa nama')+'</b>';
      if (loc.profiles) h += ' <small style="color:#888;">oleh '+loc.profiles.nama+'</small>';
      h += '<br><small>'+new Date(loc.created_at).toLocaleDateString('id-ID')+' '+b+'</small>'+f+'</div>';
      h += '<div style="display:flex;gap:3px;">';
      if (loc.status==='aktif') h += '<button class="btn-sm btn-g" onclick="verifikasi('+loc.id+')">✅</button>';
      h += '<button class="btn-sm btn-r" onclick="hapusLok('+loc.id+')">🗑️</button>';
      h += '</div></div>';
    });
  } else h = '<p style="text-align:center;color:#888;padding:20px;">Belum ada lokasi</p>';
  document.getElementById('adminTable').innerHTML = h;
}
async function verifikasi(id) { 
  await db.from('lokasi').update({status:'diverifikasi'}).eq('id',id);
  // Tambah poin ke informan
  var l = await db.from('lokasi').select('user_id').eq('id',id).single();
  if (l.data) {
    await db.rpc('increment_poin', { uid: l.data.user_id, amount: 10 });
  }
  loadAdmin(); 
}
async function hapusLok(id) { if (confirm('Hapus?')) { await db.from('lokasi').delete().eq('id',id); loadAdmin(); } }

// ===== INFORMAN =====

function previewFoto(input) {
  var pv = document.getElementById('laporPreview'); pv.innerHTML = '';
  if (input.files) {
    for (var i = 0; i < Math.min(input.files.length, 5); i++) {
      (function(file) {
        var r = new FileReader();
        r.onload = function(e) { var img = document.createElement('img'); img.src = e.target.result; img.style.cssText='width:60px;height:60px;object-fit:cover;border-radius:6px;margin:3px;'; pv.appendChild(img); };
        r.readAsDataURL(file);
      })(input.files[i]);
    }
  }
}

async function submitLaporan() {
  var desc = document.getElementById('laporDesc').value.trim();
  var kat = document.getElementById('laporKat').value;
  var files = document.getElementById('laporFoto').files;
  
  var st = document.getElementById('laporStatus'); st.style.display='block';
  
  if (!navigator.geolocation) { alert('GPS tidak didukung'); goTo('informan'); return; }
  
  st.textContent = '📡 Mengambil lokasi...';
  navigator.geolocation.getCurrentPosition(async function(pos) {
    st.textContent = '📤 Upload foto...';
    
    var fotoUrls = [];
    if (files && files.length > 0) {
      for (var i = 0; i < Math.min(files.length, 5); i++) {
        var f = files[i];
        var fn = user.id + '/' + Date.now() + '_' + i + '.' + (f.name.split('.').pop() || 'jpg');
        var up = await db.storage.from('pkl-photos').upload(fn, f, { contentType: f.type, upsert: false });
        if (!up.error) { var u = db.storage.from('pkl-photos').getPublicUrl(fn); fotoUrls.push(u.data.publicUrl); }
      }
    }
    
    st.textContent = '💾 Menyimpan...';
    var ld = { user_id: user.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude, deskripsi: desc || 'PKL ditemukan', kategori_id: parseInt(kat), status: 'aktif' };
    if (fotoUrls.length > 0) ld.foto_url = fotoUrls;
    
    var r = await db.from('lokasi').insert(ld);
    st.style.display='none';
    
    if (r.error) { alert('❌ Gagal: ' + r.error.message); }
    else { alert('✅ Laporan terkirim! +5 poin'); await db.rpc('increment_poin', { uid: user.id, amount: 5 }); }
    goTo('informan');
    await loadProfile();
  }, function(err) { st.style.display='none'; alert('❌ GPS: ' + err.message); goTo('informan'); }, { enableHighAccuracy: true });
}

async function loadHistori() {
  var d = await db.from('lokasi').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  var h = '<h3 style="margin-bottom:10px;">Riwayat Laporan Saya</h3>';
  if (d.data && d.data.length > 0) {
    d.data.forEach(function(loc) {
      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':loc.status==='ditolak'?'r':'y') + '">'+loc.status+'</span>';
      var f = '';
      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length > 0) {
        loc.foto_url.forEach(function(u) {
          f += '<img src="'+u+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')" onerror="this.style.display=\\\'none\\\'">';
        });
      }
      h += '<div class="card"><div style="display:flex;justify-content:space-between;"><b>'+(loc.deskripsi||'PKL')+'</b>'+b+'</div>';
      h += '<div style="font-size:11px;color:#888;">'+new Date(loc.created_at).toLocaleString('id-ID')+'</div>';
      if (f) h += '<div style="margin-top:4px;">'+f+'</div>';
      h += '</div>';
    });
  } else h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada laporan</p>';
  document.getElementById('historiList').innerHTML = h;
}

// ===== PEDAGANG =====

async function loadLaporanSekitar() {
  document.getElementById('laporanSekitarList').innerHTML = '<p style="text-align:center;color:#888;padding:20px;">Memuat laporan...</p>';
  goTo('laporanSekitar');
  
  // Ambil semua lokasi tanpa perlu GPS dulu
  var d = await db.from('lokasi').select('*,profiles!inner(nama)').in('status',['aktif','diverifikasi']).order('created_at',{ascending:false}).limit(30);
  
  var h = '<h3 style="margin-bottom:10px;">📋 Laporan PKL Sekitar</h3>';
  
  if (d.error) {
    h += '<p style="color:red;text-align:center;">Error: '+d.error.message+'</p>';
  } else if (d.data && d.data.length > 0) {
    d.data.forEach(function(loc) {
      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':'y') + '">'+loc.status+'</span>';
      var f = '';
      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length > 0) {
        loc.foto_url.forEach(function(u) { f += '<img src="'+u+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')" onerror="this.style.display=\\\'none\\\'">'; });
      }
      h += '<div class="card"><div style="display:flex;justify-content:space-between;"><b>'+(loc.deskripsi||'PKL')+'</b>'+b+'</div>';
      var nama = (loc.profiles && loc.profiles.nama) ? loc.profiles.nama : 'Anonim';
      h += '<div style="font-size:11px;color:#888;">👤 '+nama+' | '+new Date(loc.created_at).toLocaleDateString('id-ID')+'</div>';
      if (f) h += '<div style="margin-top:4px;">'+f+'</div>';
      h += '<div style="margin-top:6px;display:flex;gap:4px;">';
      h += '<button class="btn-sm btn-g" onclick="beriPoin(\''+loc.user_id+'\',\''+nama+'\',\''+loc.id+'\')">⭐ Beri Poin</button>';
      h += '<button class="btn-sm btn-o" onclick="window.open(\\\'https://www.google.com/maps?q='+loc.latitude+','+loc.longitude+'\\\')">🗺️ Maps</button>';
      h += '</div></div>';
    });
  } else {
    h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada laporan PKL</p>';
  }
  document.getElementById('laporanSekitarList').innerHTML = h;
}

async function beriPoin(uid, nama, lid) {
  var jml = prompt('Berapa poin untuk ' + (nama || 'informan') + '?\n(Rekomendasi: 10-50 poin)');
  if (!jml || isNaN(jml) || parseInt(jml) < 1) return;
  await db.rpc('increment_poin', { uid: uid, amount: parseInt(jml) });
  alert('✅ ' + jml + ' poin diberikan!');
}

async function loadDaganganSaya() {
  var d = await db.from('produk').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  var h = '<h3 style="margin-bottom:10px;">Dagangan Saya</h3>';
  if (d.data && d.data.length > 0) {
    d.data.forEach(function(p) {
      h += '<div class="card"><div style="display:flex;justify-content:space-between;">';
      h += '<b>📦 '+p.nama_produk+'</b><span style="color:#FF6B35;">'+(p.harga||'')+'</span>';
      h += '</div><button class="btn-sm btn-r" style="margin-top:4px;" onclick="hapusProduk('+p.id+')">🗑️ Hapus</button></div>';
    });
  } else h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada produk. Tambah sekarang!</p>';
  document.getElementById('daganganList').innerHTML = h;
}

function tambahProduk() {
  var n = prompt('Nama produk/jualan:');
  if (!n) return;
  var h = prompt('Harga (contoh: Rp 10.000):') || '';
  db.from('produk').insert({ user_id: user.id, nama_produk: n, harga: h }).then(function(r) {
    if (r.error) alert('Gagal: '+r.error.message);
    else { alert('✅ Produk ditambahkan!'); loadDaganganSaya(); }
  });
}

async function hapusProduk(id) {
  if (!confirm('Hapus produk?')) return;
  await db.from('produk').delete().eq('id', id);
  loadDaganganSaya();
}

// ===== MAP =====
function initMap() {
  setTimeout(function() {
    var c = document.getElementById('mapContainer');
    if (myMap) { myMap.invalidateSize(); loadMarkers(); return; }
    L.Icon.Default.imagePath = 'lib/images/';
    myMap = L.map('mapContainer').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(myMap);
    markerLayer = L.layerGroup().addTo(myMap);
    loadMarkers();
  }, 300);
}

async function loadMarkers() {
  if (!myMap||!markerLayer) return;
  markerLayer.clearLayers();
  var d = await db.from('lokasi').select('*').in('status',['aktif','diverifikasi']).order('created_at',{ascending:false});
  if (d.data && d.data.length>0) {
    var b = [];
    d.data.forEach(function(loc) {
      var pc = '<b>📍 '+(loc.deskripsi||'PKL')+'</b><br><small>'+new Date(loc.created_at).toLocaleDateString('id-ID')+'</small>';
      if (loc.foto_url && loc.foto_url.length>0) pc += '<br><img src="'+loc.foto_url[0]+'" style="width:120px;border-radius:6px;margin-top:3px;">';
      var m = L.marker([loc.latitude, loc.longitude]).addTo(markerLayer).bindPopup(pc);
      b.push([loc.latitude, loc.longitude]);
    });
    myMap.fitBounds(b,{padding:[30,30]});
  }
}
function refreshMap() { loadMarkers(); }
function centerMyLoc() {
  if (!myMap || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(function(pos) {
    myMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
    L.circleMarker([pos.coords.latitude, pos.coords.longitude],{radius:8,color:'#FF6B35',fillColor:'#FF6B35',fillOpacity:0.5}).addTo(markerLayer).bindPopup('📍 Posisi kamu');
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
