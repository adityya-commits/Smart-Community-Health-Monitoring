// Health monitoring data (initial placeholder, will be overwritten by backend)
let healthData = {
  aqi: { value: 0, status: "Moderate", healthImpact: "", recommendation: "", details: {} },
  water: { value: 0, status: "Good", healthImpact: "", recommendation: "", details: {} },
  noise: { value: 0, status: "Moderate", healthImpact: "", recommendation: "", details: {} },
  risk: { value: 0, status: "Low-Moderate", healthImpact: "", recommendation: "", details: {} }
};

let healthTrend = []; // Will be populated from backend
let isAlertsEnabled = false;
let currentLocation = "current";
let trendChart;

document.addEventListener('DOMContentLoaded', async function() {
  await updateHealthDataForLocation(currentLocation); // fetch real data first
  initializeApp();
  setupEventListeners();
  initializeChart();
  startRealTimeUpdates();
  await updateChartDataFromHistory(); // fetch historical data
});

// -------------------- INITIALIZATION --------------------
function initializeApp() {
  updateHealthCards();
  updateAlertBanner();
}

// -------------------- EVENT LISTENERS --------------------
function setupEventListeners() {
  document.getElementById('viewHealthDataBtn').addEventListener('click', scrollToHealthData);
  document.getElementById('enableAlertsBtn').addEventListener('click', toggleAlerts);
  document.getElementById('locationSelect').addEventListener('change', handleLocationChange);
  document.getElementById('useCurrentLocationBtn').addEventListener('click', useCurrentLocation);
  document.getElementById('closeAlert').addEventListener('click', closeAlertBanner);

  document.querySelectorAll('.health-card').forEach(card => {
    card.addEventListener('click', function() {
      const metric = this.getAttribute('data-metric');
      openHealthModal(metric);
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
}

function scrollToHealthData() {
  document.querySelector('.health-overview').scrollIntoView({ behavior: 'smooth' });
}

function toggleAlerts() {
  isAlertsEnabled = !isAlertsEnabled;
  const btn = document.getElementById('enableAlertsBtn');
  if (isAlertsEnabled) {
    btn.textContent = 'Disable Alerts';
    btn.className = 'btn btn--primary btn--lg';
    showNotification('Health alerts enabled successfully!', 'success');
  } else {
    btn.textContent = 'Enable Alerts';
    btn.className = 'btn btn--outline btn--lg';
    showNotification('Health alerts disabled', 'info');
  }
}

function handleLocationChange(e) {
  currentLocation = e.target.value;
  showNotification('Location updated. Refreshing health data...', 'info');
  updateHealthDataForLocation(currentLocation);
}

function useCurrentLocation() {
  if (navigator.geolocation) {
    showNotification('Getting your location...', 'info');
    navigator.geolocation.getCurrentPosition(
      function(position) {
        document.getElementById('locationSelect').value = 'current';
        currentLocation = 'current';
        showNotification('Location detected successfully!', 'success');
        updateHealthDataForLocation(currentLocation);
      },
      function(error) {
        showNotification('Could not get location. Using default location.', 'warning');
        updateHealthDataForLocation(currentLocation);
      }
    );
  } else {
    showNotification('Geolocation not supported by this browser', 'error');
    updateHealthDataForLocation(currentLocation);
  }
}

// -------------------- FETCH DATA FROM BACKEND --------------------
async function updateHealthDataForLocation(location) {
  try {
    // Fetch each card individually
    const [aqiRes, waterRes, noiseRes, riskRes] = await Promise.all([
      fetch('http://localhost:5000/api/aqi'),
      fetch('http://localhost:5000/api/water'),
      fetch('http://localhost:5000/api/noise'),
      fetch('http://localhost:5000/api/risk')
    ]);

    const aqiData = await aqiRes.json();
    const waterData = await waterRes.json();
    const noiseData = await noiseRes.json();
    const riskData = await riskRes.json();

    // Update AQI card
    healthData.aqi.value = aqiData.aqi;
    healthData.aqi.details = {
      pm25: parseFloat(aqiData.pm25),
      pm10: parseFloat(aqiData.pm10),
      no2: parseFloat(aqiData.no2),
      o3: parseFloat(aqiData.o3)
    };

    // Update Water card
    healthData.water.value = parseFloat(waterData.ph);
    healthData.water.details = {
      ph: parseFloat(waterData.ph),
      dissolved_oxygen: parseFloat(waterData.dissolved_oxygen),
      contaminants: parseFloat(waterData.contaminants)
    };

    // Update Noise card
    healthData.noise.value = parseFloat(noiseData.noise);

    // Update Health Risk card
    healthData.risk.value = riskData.risk === "High" ? 7 : riskData.risk === "Moderate" ? 4 : 2;

    // Update UI
    updateHealthStatus();
    updateHealthCards();
    updateAlertBanner();
    updateChart();
  } catch(err) {
    console.error("Error fetching backend data:", err);
    showNotification('Failed to fetch live health data', 'error');
  }
}

async function updateChartDataFromHistory() {
  try {
    const res = await fetch('http://localhost:5000/api/pollution/history');
    const history = await res.json();

    healthTrend = history.map(item => ({
      hour: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk: item.aqi > 150 ? 7 : item.aqi > 100 ? 4 : 2
    }));

    trendChart.data.labels = healthTrend.map(h => h.hour);
    trendChart.data.datasets[0].data = healthTrend.map(h => h.risk);
    trendChart.update();
  } catch(err) {
    console.error("Failed to fetch history:", err);
  }
}

// -------------------- REALTIME UPDATES --------------------
function startRealTimeUpdates() {
  setInterval(() => {
    updateHealthDataForLocation(currentLocation);
  }, 30000);
}

// -------------------- HELPER FUNCTIONS --------------------
function updateHealthStatus() {
  healthData.aqi.status = healthData.aqi.value <= 50 ? "Good" : healthData.aqi.value <= 100 ? "Moderate" : "Unhealthy";
  healthData.water.status = healthData.water.value <= 15 ? "Good" : healthData.water.value <= 25 ? "Moderate" : "Poor";
  healthData.noise.status = healthData.noise.value <= 55 ? "Good" : healthData.noise.value <= 70 ? "Moderate" : "Unhealthy";
  healthData.risk.status = healthData.risk.value <= 3 ? "Low" : healthData.risk.value <= 6 ? "Low-Moderate" : "High";
}

function formatHealthValue(value, metric) {
  return metric === 'water' || metric === 'risk' ? Math.round(value * 10) / 10 : Math.round(value);
}

function updateHealthCards() {
  updateCard('aqi', formatHealthValue(healthData.aqi.value, 'aqi'), 'AQI', healthData.aqi.status, healthData.aqi.healthImpact);
  updateCard('water', formatHealthValue(healthData.water.value, 'water'), 'mg/L', healthData.water.status, healthData.water.healthImpact);
  updateCard('noise', formatHealthValue(healthData.noise.value, 'noise'), 'dB', healthData.noise.status, healthData.noise.healthImpact);
  updateCard('risk', formatHealthValue(healthData.risk.value, 'risk'), '/10', healthData.risk.status, healthData.risk.healthImpact);
}

function updateCard(metric, value, unit, status, description) {
  const card = document.querySelector(`[data-metric="${metric}"]`);
  if (!card) return;
  card.querySelector('.value').textContent = value;
  card.querySelector('.unit').textContent = unit;
  card.querySelector('.card-description').textContent = description;
  const statusElement = card.querySelector('.card-status');
  statusElement.textContent = status;
  card.className = 'health-card ' + getStatusClass(status);
  statusElement.className = 'card-status ' + getStatusClass(status);
}

function getStatusClass(status) {
  switch(status.toLowerCase()) {
    case 'good': return 'good';
    case 'moderate': return 'moderate';
    case 'unhealthy':
    case 'poor': return 'unhealthy';
    case 'low':
    case 'low-moderate': return 'low-moderate';
    default: return 'moderate';
  }
}

function closeAlertBanner() {
  document.getElementById('alertBanner').style.display = 'none';
}

function updateAlertBanner() {
  const alertBanner = document.getElementById('alertBanner');
  const alertTitle = document.querySelector('.alert-title');
  const alertMessage = document.querySelector('.alert-message');

  if (healthData.aqi.value > 100 || healthData.risk.value > 5) {
    alertBanner.className = 'alert-banner high';
    alertTitle.textContent = 'High Health Risk Alert';
    alertMessage.textContent = 'Multiple health indicators are at concerning levels. Take immediate precautions.';
  } else if (healthData.aqi.value > 50 || healthData.noise.value > 65) {
    alertBanner.className = 'alert-banner moderate';
    alertTitle.textContent = 'Moderate Air Quality Alert';
    alertMessage.textContent = 'Air quality has declined due to increased particulate matter. Sensitive individuals should limit outdoor activities.';
  }
}

// -------------------- MODAL --------------------
function openHealthModal(metric) {
  const modal = document.getElementById('healthModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const data = healthData[metric];
  if (!data) return;

  const titles = {
    aqi: 'Air Quality Index Details',
    water: 'Water Quality Details',
    noise: 'Noise Pollution Details',
    risk: 'Health Risk Score Details'
  };

  modalTitle.textContent = titles[metric];

  let detailsHTML = `<div class="modal-metric-overview">
      <div class="modal-value">
        <span class="modal-value-number">${formatHealthValue(data.value, metric)}</span>
        <span class="modal-value-unit">${data.unit || getUnitForMetric(metric)}</span>
      </div>
      <div class="modal-status ${getStatusClass(data.status)}">${data.status}</div>
    </div>
    <div class="modal-section">
      <h3>Health Impact</h3>
      <p>${data.healthImpact}</p>
    </div>
    <div class="modal-section">
      <h3>Recommendation</h3>
      <p>${data.recommendation}</p>
    </div>`;

  if (data.details) {
    detailsHTML += '<div class="modal-section"><h3>Detailed Breakdown</h3>';
    for (const [key,value] of Object.entries(data.details)) {
      detailsHTML += `<div class="detail-item">
        <span class="detail-label">${formatLabel(key)}:</span>
        <span class="detail-value">${typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}</span>
      </div>`;
    }
    detailsHTML += '</div>';
  }

  modalBody.innerHTML = detailsHTML;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('healthModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function getUnitForMetric(metric) {
  const units = {
    aqi: 'AQI',
    water: 'mg/L',
    noise: 'dB',
    risk: '/10'
  };
  return units[metric] || '';
}

function formatLabel(key) {
  const labels = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO2',
    o3: 'O3',
    bacterial: 'Bacterial Count',
    chemical: 'Chemical Pollutants',
    ph: 'pH Level',
    chlorine: 'Chlorine (mg/L)',
    daytime: 'Daytime Average',
    nighttime: 'Nighttime Average',
    peak: 'Peak Level',
    respiratory: 'Respiratory Risk',
    cardiovascular: 'Cardiovascular Risk',
    allergies: 'Allergy Risk'
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// -------------------- CHART --------------------
function initializeChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: healthTrend.map(item => item.hour),
      datasets: [{
        label: 'Health Risk Level',
        data: healthTrend.map(item => item.risk),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1FB8CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 10, title: { display: true, text: 'Risk Level (0-10)' } },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });
}

function updateChart() {
  if (trendChart) {
    trendChart.data.datasets[0].data = healthTrend.map(h => h.risk);
    trendChart.update();
  }
}

// -------------------- NOTIFICATIONS --------------------
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '9999',
    maxWidth: '300px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease'
  });

  const colors = { success: '#21C55D', error: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);
  setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}
