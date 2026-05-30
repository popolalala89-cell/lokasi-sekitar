// Lokasi Sekitar - Main App Logic

// Check if running in Capacitor
const isCapacitor = () => {
  return typeof window !== 'undefined' && 
         typeof window.Capacitor !== 'undefined';
};

// Share location functionality
async function shareLocation() {
  const statusEl = document.getElementById('status');
  statusEl.textContent = '🔄 Mengambil lokasi...';
  
  try {
    if (isCapacitor() && window.CapacitorPlugins?.Geolocation) {
      // Native Capacitor Geolocation
      const coordinates = await window.CapacitorPlugins.Geolocation.getCurrentPosition();
      await sendLocation(coordinates.coords.latitude, coordinates.coords.longitude);
    } else {
      // Fallback: Browser Geolocation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await sendLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          statusEl.textContent = `❌ Error: ${error.message}`;
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  } catch (error) {
    statusEl.textContent = `❌ Gagal: ${error.message}`;
    console.error('Share location error:', error);
  }
}

// Send location to backend/Telegram
async function sendLocation(lat, lng) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = '📤 Mengirim lokasi...';
  
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch('https://your-api.com/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        timestamp: new Date().toISOString(),
        user_id: getUserID()
      })
    });
    
    if (response.ok) {
      statusEl.textContent = '✅ Lokasi terkirim!';
      setTimeout(() => {
        statusEl.textContent = 'Siap digunakan!';
      }, 3000);
    } else {
      throw new Error('Gagal mengirim lokasi');
    }
  } catch (error) {
    // Fallback: Open Telegram with location link
    const telegramLink = `https://t.me/LokasiSekitarBot?start=${lat},${lng}`;
    statusEl.textContent = '🔗 Membuka Telegram...';
    window.open(telegramLink, '_blank');
    
    setTimeout(() => {
      statusEl.textContent = '✅ Dibuka di Telegram!';
      setTimeout(() => {
        statusEl.textContent = 'Siap digunakan!';
      }, 3000);
    }, 1000);
  }
}

// View locations functionality
async function viewLocations() {
  const statusEl = document.getElementById('status');
  statusEl.textContent = '🗺️ Membuka peta...';
  
  // Open Telegram bot or web map
  window.open('https://t.me/LokasiSekitarBot', '_blank');
  
  setTimeout(() => {
    statusEl.textContent = 'Siap digunakan!';
  }, 2000);
}

// Get user ID (simple implementation)
function getUserID() {
  let userID = localStorage.getItem('lokasi_sekitar_user_id');
  if (!userID) {
    userID = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('lokasi_sekitar_user_id', userID);
  }
  return userID;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log('Lokasi Sekitar app initialized');
  
  // Request permissions if running in Capacitor
  if (isCapacitor()) {
    console.log('Running in Capacitor environment');
  }
});
