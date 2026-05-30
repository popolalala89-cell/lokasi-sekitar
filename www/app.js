     1|// ===== GLOBALS =====
     2|var db, user, profile, myMap, markerLayer, prevScreen;
     3|var SUPABASE_URL = 'https://dnpbyfpbbwkgsfwmzlva.supabase.co';
     4|var SUPABASE_KEY = 'sb_publishable_XV71tP1dBZMyHg30p3aWIw_Phv5hbay';
     5|
// ===== INIT =====
var initReady = false;
function init() {
  if (typeof supabase !== 'undefined') {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    initReady = true;
    checkSession();
  } else {
    setTimeout(init, 500);
  }
}
    11|
    12|async function checkSession() {
    13|  try {
    14|    var r = await db.auth.getSession();
    15|    if (r.data.session) { user = r.data.session.user; await loadProfile(); goTo(profile.role); }
    16|  } catch(e) {}
    17|}
    18|
    19|async function loadProfile() {
    20|  var p = await db.from('profiles').select('*').eq('id', user.id).single();
    21|  profile = p.data;
    22|}
    23|
    24|function goTo(s) {
    25|  prevScreen = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : null;
    26|  document.querySelectorAll('.screen').forEach(function(x) { x.classList.remove('active'); });
    27|  var el = document.getElementById(s);
    28|  if (el) el.classList.add('active');
    29|  if (s === 'admin') { document.getElementById('adminUser').textContent = profile ? profile.nama : ''; loadAdmin(); }
    30|  if (s === 'informan') { document.getElementById('informanUser').textContent = profile ? profile.nama : ''; document.getElementById('informanPoin').textContent = (profile ? profile.poin || 0 : 0) + ' ⭐'; }
    31|  if (s === 'pedagang') { document.getElementById('pedagangUser').textContent = profile ? profile.nama : ''; }
    32|  if (s === 'histori') loadHistori();
    33|  if (s === 'daganganSaya') loadDaganganSaya();
    34|  if (s === 'mapView') initMap();
    35|}
    36|
    37|function goBack() {
    38|  if (prevScreen && document.getElementById(prevScreen)) goTo(prevScreen);
    39|  else goTo(profile ? profile.role : 'login');
    40|}
    41|
    42|// ===== AUTH =====
async function doLogin() {
  if (!db || !initReady) { alert('⏳ Menghubungkan ke server... Tunggu sebentar.'); return; }
  var e = document.getElementById('loginEmail').value.trim(), p = document.getElementById('loginPassword').value.trim();
  if (!e || !p) { alert('Isi email dan password'); return; }
  try {
    var r = await db.auth.signInWithPassword({ email: e, password: p });
    if (r.error) { alert('Gagal: ' + r.error.message); return; }
    user = r.data.user; await loadProfile(); goTo(profile.role);
  } catch(err) { alert('Error: ' + err.message); }
}
    50|
    51|async function doRegister() {
    52|  var n = document.getElementById('regNama').value.trim(), e = document.getElementById('regEmail').value.trim();
    53|  var p = document.getElementById('regPassword').value.trim(), rl = document.getElementById('regRole').value;
    54|  if (!n || !e || !p) { alert('Isi semua field'); return; }
    55|  if (p.length < 6) { alert('Password minimal 6 karakter'); return; }
    56|  var r = await db.auth.signUp({ email: e, password: p });
    57|  if (r.error) { alert('Gagal: ' + r.error.message); return; }
    58|  await db.from('profiles').update({ nama: n, role: rl }).eq('id', r.data.user.id);
    59|  alert('✅ Registrasi berhasil! Silakan login.'); goTo('login');
    60|}
    61|
    62|async function doLogout() { await db.auth.signOut(); user = null; profile = null; goTo('login'); }
    63|
    64|// ===== HELPER: get profiles map =====
    65|async function getProfileNames(userIds) {
    66|  var uniqueIds = [];
    67|  userIds.forEach(function(id) { if (uniqueIds.indexOf(id) === -1) uniqueIds.push(id); });
    68|  if (uniqueIds.length === 0) return {};
    69|  var d = await db.from('profiles').select('id,nama').in('id', uniqueIds);
    70|  var map = {};
    71|  if (d.data) d.data.forEach(function(p) { map[p.id] = p.nama || 'Anonim'; });
    72|  return map;
    73|}
    74|
    75|// ===== ADMIN =====
    76|async function loadAdmin() {
    77|  var l = await db.from('lokasi').select('id',{count:'exact',head:true});
    78|  var la = await db.from('lokasi').select('id',{count:'exact',head:true}).eq('status','aktif');
    79|  var u = await db.from('profiles').select('id',{count:'exact',head:true});
    80|  document.getElementById('sLokasi').textContent = l.count||0;
    81|  document.getElementById('sAktif').textContent = la.count||0;
    82|  document.getElementById('sUser').textContent = u.count||0;
    83|  document.getElementById('sPending').textContent = la.count||0;
    84|  
    85|  var d = await db.from('lokasi').select('*').order('created_at',{ascending:false}).limit(30);
    86|  var userIds = [];
    87|  if (d.data) d.data.forEach(function(loc) { if (loc.user_id) userIds.push(loc.user_id); });
    88|  var nameMap = await getProfileNames(userIds);
    89|  
    90|  var h = '';
    91|  if (d.data && d.data.length > 0) {
    92|    d.data.forEach(function(loc) {
    93|      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':loc.status==='ditolak'?'r':'y') + '">'+loc.status+'</span>';
    94|      var f = '';
    95|      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length > 0) {
    96|        loc.foto_url.forEach(function(u) { f += '<img src="'+u+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')" onerror="this.style.display=\\\'none\\\'" loading="lazy">'; });
    97|      }
    98|      h += '<div class="row"><div><b>'+(loc.deskripsi||'Tanpa nama')+'</b>';
    99|      h += ' <small style="color:#888;">oleh '+(nameMap[loc.user_id]||'?')+'</small>';
   100|      h += '<br><small>'+new Date(loc.created_at).toLocaleDateString('id-ID')+' '+b+'</small>'+f+'</div>';
   101|      h += '<div style="display:flex;gap:3px;">';
   102|      if (loc.status==='aktif') h += '<button class="btn-sm btn-g" onclick="verifikasi('+loc.id+')">✅ Verif</button>';
   103|      if (loc.status==='aktif') h += '<button class="btn-sm btn-r" onclick="tolak('+loc.id+')">❌ Tolak</button>';
   104|      h += '<button class="btn-sm btn-r" onclick="hapusLok('+loc.id+')">🗑️</button>';
   105|      h += '</div></div>';
   106|    });
   107|  } else h = '<p style="text-align:center;color:#888;padding:20px;">Belum ada lokasi</p>';
   108|  document.getElementById('adminTable').innerHTML = h;
   109|}
   110|async function verifikasi(id) { 
   111|  await db.from('lokasi').update({status:'diverifikasi'}).eq('id',id);
   112|  var l = await db.from('lokasi').select('user_id').eq('id',id).single();
   113|  if (l.data) await db.rpc('increment_poin', { uid: l.data.user_id, amount: 10 });
   114|  loadAdmin(); 
   115|}
   116|async function tolak(id) { await db.from('lokasi').update({status:'ditolak'}).eq('id',id); loadAdmin(); }
   117|async function hapusLok(id) { if (confirm('Hapus?')) { await db.from('lokasi').delete().eq('id',id); loadAdmin(); } }
   118|
   119|// ===== INFORMAN =====
   120|function previewFoto(input) {
   121|  var pv = document.getElementById('laporPreview'); pv.innerHTML = '';
   122|  if (input.files) {
   123|    for (var i = 0; i < Math.min(input.files.length, 5); i++) {
   124|      (function(file) {
   125|        var r = new FileReader();
   126|        r.onload = function(e) { var img = document.createElement('img'); img.src = e.target.result; img.style.cssText='width:60px;height:60px;object-fit:cover;border-radius:6px;margin:3px;'; pv.appendChild(img); };
   127|        r.readAsDataURL(file);
   128|      })(input.files[i]);
   129|    }
   130|  }
   131|}
   132|
   133|async function submitLaporan() {
   134|  var desc = document.getElementById('laporDesc').value.trim();
   135|  var kat = document.getElementById('laporKat').value;
   136|  var files = document.getElementById('laporFoto').files;
   137|  
   138|  var st = document.getElementById('laporStatus'); st.style.display='block';
   139|  
   140|  if (!navigator.geolocation) { alert('GPS tidak didukung'); goTo('informan'); return; }
   141|  
   142|  st.textContent = '📡 Mengambil lokasi...';
   143|  navigator.geolocation.getCurrentPosition(async function(pos) {
   144|    st.textContent = '📤 Upload foto...';
   145|    
   146|    var fotoUrls = [];
   147|    if (files && files.length > 0) {
   148|      for (var i = 0; i < Math.min(files.length, 5); i++) {
   149|        var f = files[i];
   150|        var fn = user.id + '/' + Date.now() + '_' + i + '.' + (f.name.split('.').pop() || 'jpg');
   151|        var up = await db.storage.from('pkl-photos').upload(fn, f, { contentType: f.type, upsert: false });
   152|        if (!up.error) { var u = db.storage.from('pkl-photos').getPublicUrl(fn); fotoUrls.push(u.data.publicUrl); }
   153|      }
   154|    }
   155|    
   156|    st.textContent = '💾 Menyimpan...';
   157|    var ld = { user_id: user.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude, deskripsi: desc || 'PKL ditemukan', kategori_id: parseInt(kat), status: 'aktif' };
   158|    if (fotoUrls.length > 0) ld.foto_url = fotoUrls;
   159|    
   160|    var r = await db.from('lokasi').insert(ld);
   161|    st.style.display='none';
   162|    
   163|    if (r.error) { alert('❌ Gagal: ' + r.error.message); }
   164|    else {
   165|      alert('✅ Laporan terkirim! +5 poin');
   166|      await db.rpc('increment_poin', { uid: user.id, amount: 5 });
   167|      // Reset form
   168|      document.getElementById('laporDesc').value = '';
   169|      document.getElementById('laporKat').value = '7';
   170|      document.getElementById('laporFoto').value = '';
   171|      document.getElementById('laporPreview').innerHTML = '';
   172|    }
   173|    goTo('informan');
   174|    await loadProfile();
   175|  }, function(err) { st.style.display='none'; alert('❌ GPS: ' + err.message); goTo('informan'); }, { enableHighAccuracy: true });
   176|}
   177|
   178|async function loadHistori() {
   179|  var d = await db.from('lokasi').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
   180|  var h = '<h3 style="margin-bottom:10px;">📋 Riwayat Laporan Saya</h3>';
   181|  if (d.data && d.data.length > 0) {
   182|    d.data.forEach(function(loc) {
   183|      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':loc.status==='ditolak'?'r':'y') + '">'+loc.status+'</span>';
   184|      var f = '';
   185|      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length > 0) {
   186|        // Use Supabase image transform for smaller thumbnails
   187|        loc.foto_url.forEach(function(u) {
   188|          var thumbUrl = u + '';
   189|          f += '<img src="'+thumbUrl+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')" onerror="this.style.display=\\\'none\\\'" loading="lazy">';
   190|        });
   191|      }
   192|      h += '<div class="card"><div style="display:flex;justify-content:space-between;"><b>'+(loc.deskripsi||'PKL')+'</b>'+b+'</div>';
   193|      h += '<div style="font-size:11px;color:#888;">'+new Date(loc.created_at).toLocaleString('id-ID')+'</div>';
   194|      if (f) h += '<div style="margin-top:4px;">'+f+'</div>';
   195|      h += '</div>';
   196|    });
   197|  } else h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada laporan</p>';
   198|  document.getElementById('historiList').innerHTML = h;
   199|}
   200|
   201|// ===== PEDAGANG =====
   202|async function loadLaporanSekitar() {
   203|  document.getElementById('laporanSekitarList').innerHTML = '<p style="text-align:center;color:#888;padding:20px;">Memuat laporan...</p>';
   204|  goTo('laporanSekitar');
   205|  
   206|  var d = await db.from('lokasi').select('*').in('status',['aktif','diverifikasi']).order('created_at',{ascending:false}).limit(30);
   207|  
   208|  // Get profile names separately
   209|  var userIds = [];
   210|  if (d.data) d.data.forEach(function(loc) { if (loc.user_id) userIds.push(loc.user_id); });
   211|  var nameMap = await getProfileNames(userIds);
   212|  
   213|  var h = '<h3 style="margin-bottom:10px;">📋 Laporan PKL Sekitar</h3>';
   214|  
   215|  if (d.error) {
   216|    h += '<p style="color:red;text-align:center;">Error: '+d.error.message+'</p>';
   217|  } else if (d.data && d.data.length > 0) {
   218|    d.data.forEach(function(loc) {
   219|      var b = '<span class="badge bg-' + (loc.status==='diverifikasi'?'g':'y') + '">'+loc.status+'</span>';
   220|      var f = '';
   221|      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length > 0) {
   222|        loc.foto_url.forEach(function(u) {
   223|          var thumbUrl = u + '';
   224|          f += '<img src="'+thumbUrl+'" class="foto-thumb" onclick="window.open(\\\''+u+'\\\')" onerror="this.style.display=\\\'none\\\'" loading="lazy">';
   225|        });
   226|      }
   227|      h += '<div class="card"><div style="display:flex;justify-content:space-between;"><b>'+(loc.deskripsi||'PKL')+'</b>'+b+'</div>';
   228|      h += '<div style="font-size:11px;color:#888;">👤 '+(nameMap[loc.user_id]||'Anonim')+' | '+new Date(loc.created_at).toLocaleDateString('id-ID')+'</div>';
   229|      if (f) h += '<div style="margin-top:4px;">'+f+'</div>';
   230|      h += '<div style="margin-top:6px;display:flex;gap:4px;">';
   231|      h += '<button class="btn-sm btn-g" onclick="beriPoin(\''+loc.user_id+'\',\''+(nameMap[loc.user_id]||'Anonim')+'\',\''+loc.id+'\')">⭐ Beri Poin</button>';
   232|      h += '<button class="btn-sm btn-o" onclick="window.open(\\\'https://www.google.com/maps?q='+loc.latitude+','+loc.longitude+'\\\',\\\'_system\\\')">🗺️ Maps</button>';
   233|      h += '</div></div>';
   234|    });
   235|  } else {
   236|    h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada laporan PKL</p>';
   237|  }
   238|  document.getElementById('laporanSekitarList').innerHTML = h;
   239|}
   240|
   241|async function beriPoin(uid, nama, lid) {
   242|  var jml = prompt('Berapa poin untuk ' + (nama || 'informan') + '?\n(Rekomendasi: 10-50 poin)');
   243|  if (!jml || isNaN(jml) || parseInt(jml) < 1) return;
   244|  await db.rpc('increment_poin', { uid: uid, amount: parseInt(jml) });
   245|  alert('✅ ' + jml + ' poin diberikan!');
   246|}
   247|
   248|// ===== DAGANGAN =====
   249|async function loadDaganganSaya() {
   250|  var d = await db.from('produk').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
   251|  var h = '<h3 style="margin-bottom:10px;">📦 Dagangan Saya</h3>';
   252|  if (d.data && d.data.length > 0) {
   253|    d.data.forEach(function(p) {
   254|      h += '<div class="card"><div style="display:flex;justify-content:space-between;">';
   255|      h += '<b>📦 '+p.nama_produk+'</b><span style="color:#FF6B35;">'+(p.harga||'')+'</span>';
   256|      h += '</div><button class="btn-sm btn-r" style="margin-top:4px;" onclick="hapusProduk('+p.id+')">🗑️ Hapus</button></div>';
   257|    });
   258|  } else h += '<p style="text-align:center;color:#888;padding:20px;">Belum ada produk. Tambah sekarang!</p>';
   259|  document.getElementById('daganganList').innerHTML = h;
   260|}
   261|
   262|function tambahProduk() {
   263|  var n = prompt('Nama produk/jualan:');
   264|  if (!n) return;
   265|  var h = prompt('Harga (contoh: Rp 10.000):') || '';
   266|  db.from('produk').insert({ user_id: user.id, nama_produk: n, harga: h }).then(function(r) {
   267|    if (r.error) alert('Gagal: '+r.error.message);
   268|    else { alert('✅ Produk ditambahkan!'); loadDaganganSaya(); }
   269|  });
   270|}
   271|
   272|async function hapusProduk(id) {
   273|  if (!confirm('Hapus produk?')) return;
   274|  await db.from('produk').delete().eq('id', id);
   275|  loadDaganganSaya();
   276|}
   277|
   278|// ===== MAP =====
   279|function initMap() {
   280|  setTimeout(function() {
   281|    var c = document.getElementById('mapContainer');
   282|    if (myMap) { myMap.invalidateSize(); loadMarkers(); return; }
   283|    L.Icon.Default.imagePath = 'lib/images/';
   284|    myMap = L.map('mapContainer').setView([-6.2, 106.8], 13);
   285|    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(myMap);
   286|    markerLayer = L.layerGroup().addTo(myMap);
   287|    loadMarkers();
   288|  }, 300);
   289|}
   290|
   291|async function loadMarkers() {
   292|  if (!myMap||!markerLayer) return;
   293|  markerLayer.clearLayers();
   294|  var d = await db.from('lokasi').select('*').in('status',['aktif','diverifikasi']).order('created_at',{ascending:false});
   295|  if (d.data && d.data.length>0) {
   296|    var b = [];
   297|    d.data.forEach(function(loc) {
   298|      var pc = '<b>📍 '+(loc.deskripsi||'PKL')+'</b><br><small>'+new Date(loc.created_at).toLocaleDateString('id-ID')+'</small>';
   299|      if (loc.foto_url && Array.isArray(loc.foto_url) && loc.foto_url.length>0) {
   300|        pc += '<br><img src="'+loc.foto_url[0]+'" style="width:120px;border-radius:6px;margin-top:3px;" loading="lazy">';
   301|      }
   302|      var m = L.marker([loc.latitude, loc.longitude]).addTo(markerLayer).bindPopup(pc);
   303|      b.push([loc.latitude, loc.longitude]);
   304|    });
   305|    myMap.fitBounds(b,{padding:[30,30]});
   306|  }
   307|}
   308|function refreshMap() { loadMarkers(); }
   309|function centerMyLoc() {
   310|  if (!myMap || !navigator.geolocation) return;
   311|  navigator.geolocation.getCurrentPosition(function(pos) {
   312|    myMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
   313|    L.circleMarker([pos.coords.latitude, pos.coords.longitude],{radius:8,color:'#FF6B35',fillColor:'#FF6B35',fillOpacity:0.5}).addTo(markerLayer).bindPopup('📍 Posisi kamu');
   314|  });
   315|}
   316|
   317|// Start
   318|document.addEventListener('DOMContentLoaded', init);
   319|