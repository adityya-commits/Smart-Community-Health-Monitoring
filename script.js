// Health monitoring data
let healthData = {
  aqi: {
    value: 85,
    status: "Moderate",
    healthImpact: "Sensitive individuals may experience minor breathing issues",
    recommendation: "Consider wearing a mask if you have respiratory conditions",
    details: {
      pm25: 45,
      pm10: 78,
      no2: 32,
      o3: 65
    }
  },
  water: {
    value: 12,
    unit: "mg/L contamination",
    status: "Good",
    healthImpact: "Safe for consumption with standard filtration",
    recommendation: "Continue regular water filtration practices",
    details: {
      bacterial: "Low",
      chemical: "Acceptable",
      ph: 7.2,
      chlorine: 0.5
    }
  },
  noise: {
    value: 68,
    unit: "dB",
    status: "Moderate",
    healthImpact: "May cause stress and sleep disturbances",
    recommendation: "Consider noise-canceling devices during sleep",
    details: {
      daytime: 72,
      nighttime: 45,
      peak: 85
    }
  },
  risk: {
    value: 3.2,
    unit: "/10 risk level",
    status: "Low-Moderate",
    healthImpact: "Overall health risk is manageable",
    recommendation: "Monitor daily and follow basic precautions",
    details: {
      respiratory: 2.8,
      cardiovascular: 3.1,
      allergies: 3.5
    }
  }
};

let healthTrend = [
  { hour: "06:00", risk: 2.1 },
  { hour: "09:00", risk: 2.8 },
  { hour: "12:00", risk: 3.5 },
  { hour: "15:00", risk: 3.2 },
  { hour: "18:00", risk: 3.0 }
];

let isAlertsEnabled = false;
let currentLocation = "current";
let trendChart;


document.addEventListener('', function() {
  initializeApp();
  setupEventListeners();
  initializeChart();
  startRealTimeUpdates();
});

function initializeApp() {
  updateHealthCards();
  updateAlertBanner();
}

function setupEventListeners() {
  
  document.getElementById('viewHealthDataBtn').addEventListener('click', scrollToHealthData);
  document.getElementById('enableAlertsBtn').addEventListener('click', toggleAlerts);
  
  
  document.getElementById('locationSelect').addEventListener('change', handleLocationChange);
  document.getElementById('useCurrentLocationBtn').addEventListener('click', useCurrentLocation);
  
  
  document.getElementById('closeAlert').addEventListener('click', closeAlertBanner);
  
  // Health cards
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
  document.querySelector('.health-overview').scrollIntoView({ 
    behavior: 'smooth' 
  });
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
  
  // Simulate data update for different location
  setTimeout(() => {
    updateHealthDataForLocation(currentLocation);
    updateHealthCards();
    updateChart();
    showNotification('Health data updated for new location', 'success');
  }, 1500);
}

function useCurrentLocation() {
  if (navigator.geolocation) {
    showNotification('Getting your location...', 'info');
    navigator.geolocation.getCurrentPosition(
      function(position) {
        document.getElementById('locationSelect').value = 'current';
        currentLocation = 'current';
        showNotification('Location detected successfully!', 'success');
      },
      function(error) {
        showNotification('Could not get location. Using default location.', 'warning');
      }
    );
  } else {
    showNotification('Geolocation is not supported by this browser', 'error');
  }
}

function updateHealthDataForLocation(location) {
  // Simulate different data for different locations
  const locationModifiers = {
    current: { aqi: 0, water: 0, noise: 0, risk: 0 },
    mumbai: { aqi: 15, water: -3, noise: 10, risk: 0.5 },
    bangalore: { aqi: -10, water: -5, noise: -5, risk: -0.3 },
    chennai: { aqi: 5, water: 2, noise: 8, risk: 0.2 }
  };
  
  const modifier = locationModifiers[location] || locationModifiers.current;
  
  healthData.aqi.value = Math.round(Math.max(0, Math.min(500, 85 + modifier.aqi)));
  healthData.water.value = Math.round(Math.max(0, 12 + modifier.water) * 10) / 10;
  healthData.noise.value = Math.round(Math.max(0, 68 + modifier.noise));
  healthData.risk.value = Math.round(Math.max(0, Math.min(10, 3.2 + modifier.risk)) * 10) / 10;
  
  // Update status based on new values
  updateHealthStatus();
}

function updateHealthStatus() {
  // Update AQI status
  if (healthData.aqi.value <= 50) {
    healthData.aqi.status = "Good";
  } else if (healthData.aqi.value <= 100) {
    healthData.aqi.status = "Moderate";
  } else {
    healthData.aqi.status = "Unhealthy";
  }
  

  if (healthData.water.value <= 15) {
    healthData.water.status = "Good";
  } else if (healthData.water.value <= 25) {
    healthData.water.status = "Moderate";
  } else {
    healthData.water.status = "Poor";
  }
  

  if (healthData.noise.value <= 55) {
    healthData.noise.status = "Good";
  } else if (healthData.noise.value <= 70) {
    healthData.noise.status = "Moderate";
  } else {
    healthData.noise.status = "Unhealthy";
  }
  

  if (healthData.risk.value <= 3.0) {
    healthData.risk.status = "Low";
  } else if (healthData.risk.value <= 6.0) {
    healthData.risk.status = "Low-Moderate";
  } else {
    healthData.risk.status = "High";
  }
}

function formatHealthValue(value, metric) {
  if (metric === 'aqi' || metric === 'noise') {
    return Math.round(value);
  } else if (metric === 'water' || metric === 'risk') {
    return Math.round(value * 10) / 10;
  }
  return Math.round(value);
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
  
  // Update card classes based on status
  card.className = 'health-card ' + getStatusClass(status);
  statusElement.className = 'card-status ' + getStatusClass(status);
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'good':
      return 'good';
    case 'moderate':
      return 'moderate';
    case 'unhealthy':
    case 'poor':
      return 'unhealthy';
    case 'low':
    case 'low-moderate':
      return 'low-moderate';
    default:
      return 'moderate';
  }
}

function closeAlertBanner() {
  const alertBanner = document.getElementById('alertBanner');
  alertBanner.style.display = 'none';
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
  

  let detailsHTML = `
    <div class="modal-metric-overview">
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
    </div>
  `;
  

  if (data.details) {
    detailsHTML += '<div class="modal-section"><h3>Detailed Breakdown</h3>';
    for (const [key, value] of Object.entries(data.details)) {
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

function closeModal() {
  const modal = document.getElementById('healthModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

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
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          title: {
            display: true,
            text: 'Risk Level (0-10)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        }
      }
    }
  });
}

function updateChart() {
  if (trendChart) {
    healthTrend = healthTrend.map(item => ({
      ...item,
      risk: Math.round(Math.max(0, Math.min(10, item.risk + (Math.random() - 0.5) * 0.5)) * 10) / 10
    }));
    
    trendChart.data.datasets[0].data = healthTrend.map(item => item.risk);
    trendChart.update();
  }
}

function startRealTimeUpdates() {
  setInterval(() => {
    healthData.aqi.value += (Math.random() - 0.5) * 5;
    healthData.aqi.value = Math.round(Math.max(0, Math.min(500, healthData.aqi.value)));
    
    healthData.water.value += (Math.random() - 0.5) * 2;
    healthData.water.value = Math.round(Math.max(0, healthData.water.value) * 10) / 10;
    
    healthData.noise.value += (Math.random() - 0.5) * 3;
    healthData.noise.value = Math.round(Math.max(0, healthData.noise.value));
    
    healthData.risk.value += (Math.random() - 0.5) * 0.2;
    healthData.risk.value = Math.round(Math.max(0, Math.min(10, healthData.risk.value)) * 10) / 10;
    
    updateHealthStatus();
    updateHealthCards();
    updateAlertBanner();
    updateChart();
  }, 30000); // Update every 30 seconds
}

function showNotification(message, type = 'info') {
  // Create notification element
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease'
  });
  
  
  const colors = {
    success: '#21C55D',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Animation in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  

  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}