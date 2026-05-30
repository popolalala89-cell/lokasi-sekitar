// Lokasi Sekitar - Full Standalone App
// Stores locations in localStorage, shows map and list

const STORAGE_KEY = 'lokasi_sekitar_data';

// ========== DATA MANAGEMENT ==========

function getLocations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch(e) {
    return [];
  }
}

function saveLocations(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

function addLocation(lat, lng, notes) {
  const locations = getLocations();
  locations.unshift({
    id: Date.now(),
    latitude: lat,
    longitude: lng,
    notes: notes || '',
    timestamp: new Date().toISOString()
  });
  saveLocations(locations);
  updateCount();
  return locations;
}

function deleteLocation(id) {
  let locations = getLocations();
  locations = locations.filter(l => l.id !== id);
  saveLocations(locations);
  updateCount();
  return locations;
}

// ========== NAVIGATION ==========

function showHome() {
  document.querySelectorAll('#home, #mapView, #listView').forEach(el => el.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  updateCount();
  if (currentMap) currentMap.invalidateSize();
}

function showMap() {
  document.querySelectorAll('#home, #mapView, #listView').forEach(el => el.classList.remove('active'));
  document.getElementById('mapView').classList.add('active');
  setTimeout(() => {
    initMap();
    loadMapMarkers();
  }, 100);
}

function showList() {
  document.querySelectorAll('#home, #mapView, #listView').forEach(el => el.classList.remove('active'));
  document.getElementById('listView').classList.add('active');
  renderList();
}

// ========== LOCATION SHARING ==========

function shareLocation() {
  const statusEl = document.getElementById('status');
  const emojiEl = document.getElementById('mainEmoji');
  statusEl.textContent = '🔄 Mengambil lokasi...';
  emojiEl.textContent = '📡';
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Add to storage
        addLocation(lat, lng, 'PKL ditemukan');
        
        statusEl.textContent = '✅ Lokasi PKL tersimpan!';
        emojiEl.textContent = '🎉';
        
        // Show coordinates briefly
        document.getElementById('count').textContent = 
          `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        
        setTimeout(() => {
          statusEl.textContent = 'Siap mencarikan PKL!';
          emojiEl.textContent = '📍';
          updateCount();
        }, 3000);
        
        // If on map view, refresh markers
        if (document.getElementById('mapView').classList.contains('active')) {
          loadMapMarkers();
        }
      },
      (error) => {
        statusEl.textContent = '❌ Gagal mengambil lokasi';
        emojiEl.textContent = '😕';
        document.getElementById('count').textContent = error.message;
        
        setTimeout(() => {
          statusEl.textContent = 'Siap mencarikan PKL!';
          emojiEl.textContent = '📍';
        }, 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    statusEl.textContent = '❌ Geolocation tidak didukung';
    emojiEl.textContent = '😕';
  }
}

// ========== MAP ==========
let currentMap = null;
let markerLayer = null;

function initMap() {
  if (currentMap) {
    currentMap.invalidateSize();
    return;
  }
  
  currentMap = L.map('map').setView([-6.2, 106.8], 13); // Default: Jakarta
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(currentMap);
  
  markerLayer = L.layerGroup().addTo(currentMap);
}

function loadMapMarkers() {
  if (!currentMap || !markerLayer) return;
  
  markerLayer.clearLayers();
  const locations = getLocations();
  
  if (locations.length > 0) {
    const bounds = [];
    
    locations.forEach(loc => {
      const marker = L.marker([loc.latitude, loc.longitude])
        .addTo(markerLayer)
        .bindPopup(`
          <b>📍 Lokasi PKL</b><br>
          <small>${new Date(loc.timestamp).toLocaleString('id-ID')}</small><br>
          ${loc.notes ? loc.notes : ''}
          <br><button onclick="deleteLocation(${loc.id});loadMapMarkers();renderList();updateCount();" 
            style="margin-top:6px;background:#ff4444;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;">
            Hapus
          </button>
        `);
      bounds.push([loc.latitude, loc.longitude]);
    });
    
    currentMap.fitBounds(bounds, { padding: [30, 30] });
  } else {
    currentMap.setView([-6.2, 106.8], 13);
  }
}

function centerMap() {
  if (!currentMap) return;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentMap.setView([position.coords.latitude, position.coords.longitude], 16);
        L.circleMarker([position.coords.latitude, position.coords.longitude], {
          radius: 10,
          color: '#FF6B35',
          fillColor: '#FF6B35',
          fillOpacity: 0.6
        }).addTo(markerLayer).bindPopup('📍 Posisi kamu');
      },
      () => {
        alert('Tidak bisa mengambil lokasi');
      }
    );
  }
}

// ========== LIST VIEW ==========

function renderList() {
  const container = document.getElementById('locationList');
  const locations = getLocations();
  
  if (locations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="emoji">📭</div>
        <p>Belum ada lokasi tersimpan</p>
        <br>
        <button class="btn btn-secondary btn-small" onclick="shareLocation()">+ Tambah Lokasi Pertama</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = locations.map(loc => `
    <div class="location-item">
      <div class="location-info">
        <strong>📍 ${loc.notes || 'PKL'}</strong>
        <div class="location-coords">${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</div>
        <div class="location-time">${new Date(loc.timestamp).toLocaleString('id-ID')}</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn-small btn-secondary" style="font-size:11px;padding:6px 10px;" 
          onclick="window.open('https://www.google.com/maps?q=${loc.latitude},${loc.longitude}', '_blank')">
          🗺️
        </button>
        <button class="delete-btn" onclick="deleteLocation(${loc.id});renderList();updateCount();if(document.getElementById('mapView').classList.contains('active'))loadMapMarkers();">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// ========== EXPORT / IMPORT ==========

function exportData() {
  const locations = getLocations();
  if (locations.length === 0) {
    alert('Belum ada data untuk diexport');
    return;
  }
  
  const dataStr = JSON.stringify(locations, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lokasi-sekitar-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        
        const current = getLocations();
        const merged = [...data, ...current];
        saveLocations(merged);
        updateCount();
        renderList();
        if (document.getElementById('mapView').classList.contains('active')) {
          loadMapMarkers();
        }
        alert(`✅ ${data.length} lokasi berhasil diimport!`);
      } catch(err) {
        alert('❌ File tidak valid. Harap gunakan file .json yang benar.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ========== UPDATE COUNT ==========

function updateCount() {
  const locations = getLocations();
  const countEl = document.getElementById('count');
  if (countEl) {
    countEl.textContent = locations.length > 0 
      ? `📊 ${locations.length} lokasi PKL tersimpan`
      : 'Belum ada lokasi tersimpan';
  }
}

// ========== INIT ==========

document.addEventListener('DOMContentLoaded', () => {
  updateCount();
  console.log('📍 Lokasi Sekitar - Standalone App Ready');
});
