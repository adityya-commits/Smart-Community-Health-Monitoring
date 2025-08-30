
class ConditionalHealthPrecautions {
    constructor() {
        this.thresholds = {
            aqi: {
                moderate: 51,
                unhealthy_sensitive: 101,
                unhealthy: 151,
                very_unhealthy: 201,
                hazardous: 301
            },
            pm25: {
                moderate: 12.1,
                unhealthy_sensitive: 35.5,
                unhealthy: 55.5,
                very_unhealthy: 150.5,
                hazardous: 250.5
            },
            pm10: {
                moderate: 55,
                unhealthy_sensitive: 155,
                unhealthy: 255,
                very_unhealthy: 355,
                hazardous: 425
            },
            spm: {
                moderate: 100,
                unhealthy_sensitive: 200,
                unhealthy: 300,
                very_unhealthy: 400,
                hazardous: 500
            },
            no2: {
                moderate: 54,
                unhealthy_sensitive: 101,
                unhealthy: 361,
                very_unhealthy: 650,
                hazardous: 1250
            },
            o3: {
                moderate: 55,
                unhealthy_sensitive: 71,
                unhealthy: 86,
                very_unhealthy: 106,
                hazardous: 201
            },
            so2: {
                moderate: 36,
                unhealthy_sensitive: 76,
                unhealthy: 186,
                very_unhealthy: 305,
                hazardous: 605
            },
            co: {
                moderate: 4.5,
                unhealthy_sensitive: 9.5,
                unhealthy: 12.5,
                very_unhealthy: 15.5,
                hazardous: 30.5
            }
        };

        // Conditional precautions - only show when specific conditions are met
        this.conditionalPrecautions = {
            
            aqi_moderate: {
                condition: (data) => data.aqi?.value >= this.thresholds.aqi.moderate && data.aqi?.value < this.thresholds.aqi.unhealthy_sensitive,
                title: "Moderate Air Quality Detected",
                icon: "⚠️",
                precautions: [
                    "Sensitive individuals (children, elderly, people with lung/heart disease) should limit prolonged outdoor exertion",
                    "Consider wearing a light filtering mask if you have respiratory sensitivities",
                    "Reduce outdoor exercise intensity and duration",
                    "Keep windows closed during peak pollution hours (10 AM - 4 PM)"
                ],
                cssClass: "precaution-moderate-aqi"
            },

            aqi_unhealthy_sensitive: {
                condition: (data) => data.aqi?.value >= this.thresholds.aqi.unhealthy_sensitive && data.aqi?.value < this.thresholds.aqi.unhealthy,
                title: "Air Quality Unhealthy for Sensitive Groups",
                icon: "🚨",
                precautions: [
                    "People with lung disease, asthma, or heart disease should avoid outdoor activities",
                    "Children and elderly should stay indoors",
                    "Wear N95 masks when going outside is necessary",
                    "Cancel outdoor sports and recreational activities",
                    "Use air purifiers with HEPA filters indoors"
                ],
                cssClass: "precaution-unhealthy-sensitive-aqi"
            },

            aqi_unhealthy: {
                condition: (data) => data.aqi?.value >= this.thresholds.aqi.unhealthy && data.aqi?.value < this.thresholds.aqi.very_unhealthy,
                title: "Unhealthy Air Quality - Everyone Affected",
                icon: "🔴",
                precautions: [
                    "Everyone should avoid prolonged or heavy exertion outdoors",
                    "All residents should wear protective masks (N95 or equivalent) when outside",
                    "Schools should cancel outdoor activities and sports",
                    "Close all windows and use air conditioning with recirculation",
                    "Avoid driving with windows down or using fans that bring in outside air"
                ],
                cssClass: "precaution-unhealthy-aqi"
            },

            aqi_very_unhealthy: {
                condition: (data) => data.aqi?.value >= this.thresholds.aqi.very_unhealthy && data.aqi?.value < this.thresholds.aqi.hazardous,
                title: "Very Unhealthy Air Quality - Emergency Conditions",
                icon: "☢️",
                precautions: [
                    "Everyone should avoid all outdoor activities",
                    "Mandatory N95 or N99 mask use if you must go outside",
                    "Seal gaps around doors and windows with tape",
                    "Run air purifiers continuously on highest setting",
                    "Create a 'clean room' in your home with portable air cleaners",
                    "Postpone all non-essential travel and outdoor work"
                ],
                cssClass: "precaution-very-unhealthy-aqi"
            },

            aqi_hazardous: {
                condition: (data) => data.aqi?.value >= this.thresholds.aqi.hazardous,
                title: "HAZARDOUS AIR QUALITY - HEALTH EMERGENCY",
                icon: "🆘",
                precautions: [
                    "HEALTH EMERGENCY: Avoid all outdoor exposure",
                    "Wear P100 respirators if outdoor exposure is unavoidable",
                    "Consider evacuation to cleaner areas if possible",
                    "Seek immediate medical attention for breathing difficulties",
                    "All schools, businesses, and public facilities should close",
                    "Emergency services should be on high alert"
                ],
                cssClass: "precaution-hazardous-aqi"
            },

            
            pm25_high: {
                condition: (data) => data.aqi?.details?.pm25 >= this.thresholds.pm25.unhealthy_sensitive,
                title: "High PM2.5 Levels Detected",
                icon: "🫁",
                precautions: [
                    "PM2.5 particles can penetrate deep into lungs and bloodstream",
                    "Avoid outdoor cardiovascular exercises like running or cycling",
                    "People with asthma should have rescue inhalers readily available",
                    "Pregnant women should minimize outdoor exposure",
                    "Use N95 masks specifically rated for fine particles"
                ],
                cssClass: "precaution-pm25-high"
            },

            
            pm10_high: {
                condition: (data) => data.aqi?.details?.pm10 >= this.thresholds.pm10.unhealthy_sensitive || this.getSPMValue(data) >= this.thresholds.spm.unhealthy_sensitive,
                title: "High Suspended Particulate Matter (PM10/SPM)",
                icon: "💨",
                precautions: [
                    "Coarse particles may irritate eyes, nose, and throat",
                    "Wear wraparound sunglasses to protect eyes from particle irritation",
                    "Rinse eyes with clean water if experiencing irritation",
                    "Avoid areas with visible dust, construction, or unpaved roads",
                    "Keep car windows closed and use cabin air filters"
                ],
                cssClass: "precaution-pm10-high"
            },

            
            ozone_high: {
                condition: (data) => data.aqi?.details?.o3 >= this.thresholds.o3.unhealthy_sensitive,
                title: "High Ground-Level Ozone Alert",
                icon: "☀️",
                precautions: [
                    "Ozone levels are highest during hot, sunny afternoons",
                    "Avoid outdoor activities between 10 AM and 4 PM",
                    "Ground-level ozone can cause chest pain, coughing, and throat irritation",
                    "People with asthma are especially sensitive to ozone",
                    "Choose early morning or evening for outdoor activities"
                ],
                cssClass: "precaution-ozone-high"
            },

            
            no2_high: {
                condition: (data) => data.aqi?.details?.no2 >= this.thresholds.no2.unhealthy_sensitive,
                title: "High Nitrogen Dioxide (NO2) Levels",
                icon: "🚗",
                precautions: [
                    "NO2 mainly comes from vehicle emissions and power plants",
                    "Avoid busy roads, highways, and industrial areas",
                    "NO2 can trigger asthma attacks and reduce lung function",
                    "Choose routes with less traffic when walking or cycling",
                    "Avoid outdoor exercise near major roadways"
                ],
                cssClass: "precaution-no2-high"
            },

            
            so2_high: {
                condition: (data) => data.aqi?.details?.so2 >= this.thresholds.so2.unhealthy_sensitive,
                title: "High Sulfur Dioxide (SO2) Alert",
                icon: "🏭",
                precautions: [
                    "SO2 primarily comes from fossil fuel combustion at power plants",
                    "People with asthma are extremely sensitive to SO2",
                    "Avoid areas downwind from industrial facilities",
                    "SO2 can cause breathing problems within minutes of exposure",
                    "Keep bronchodilator medications easily accessible"
                ],
                cssClass: "precaution-so2-high"
            },

            
            multiple_pollutants: {
                condition: (data) => this.checkMultiplePollutants(data),
                title: "Multiple Pollutants at Dangerous Levels",
                icon: "⚡",
                precautions: [
                    "Complex pollution mix creates elevated health risks",
                    "Synergistic effects of multiple pollutants increase health impacts",
                    "Extra precautions needed - avoid ALL outdoor activities",
                    "Consider temporary relocation if conditions persist",
                    "Monitor news and health department advisories closely"
                ],
                cssClass: "precaution-multiple-pollutants"
            }
        };

        this.activePrecautions = new Set();
        this.precautionsContainer = null;
        this.initialize();
    }

    initialize() {
        this.createPrecautionsContainer();
        this.injectCSS();
    }

    createPrecautionsContainer() {
        
        this.precautionsContainer = document.createElement('div');
        this.precautionsContainer.id = 'conditional-health-precautions';
        this.precautionsContainer.className = 'conditional-precautions-container';

        
        const existingAlert = document.getElementById('alertBanner');
        const monitoringSection = document.querySelector('.monitoring-overview') || document.querySelector('.current-status');

        if (existingAlert && existingAlert.parentNode) {
            existingAlert.parentNode.insertBefore(this.precautionsContainer, existingAlert.nextSibling);
        } else if (monitoringSection && monitoringSection.parentNode) {
            monitoringSection.parentNode.insertBefore(this.precautionsContainer, monitoringSection.nextSibling);
        } else {
            document.querySelector('main').appendChild(this.precautionsContainer);
        }
    }

    checkMultiplePollutants(data) {
        let highPollutantCount = 0;

        if (data.aqi?.details) {
            const details = data.aqi.details;
            if (details.pm25 >= this.thresholds.pm25.unhealthy_sensitive) highPollutantCount++;
            if (details.pm10 >= this.thresholds.pm10.unhealthy_sensitive) highPollutantCount++;
            if (details.no2 >= this.thresholds.no2.unhealthy_sensitive) highPollutantCount++;
            if (details.o3 >= this.thresholds.o3.unhealthy_sensitive) highPollutantCount++;
        }

        return highPollutantCount >= 2;
    }

    getSPMValue(data) {
        
        return data.spm?.value || data.aqi?.details?.pm10 || 0;
    }

    updatePrecautions(healthData) {
        
        this.precautionsContainer.innerHTML = '';
        this.activePrecautions.clear();

        
        for (const [key, precaution] of Object.entries(this.conditionalPrecautions)) {
            if (precaution.condition(healthData)) {
                this.displayPrecaution(key, precaution);
                this.activePrecautions.add(key);
            }
        }

        
        if (this.activePrecautions.size > 0) {
            this.precautionsContainer.style.display = 'block';
        } else {
            this.precautionsContainer.style.display = 'none';
        }
    }

    displayPrecaution(key, precaution) {
        const precautionElement = document.createElement('div');
        precautionElement.className = `conditional-precaution ${precaution.cssClass}`;

        precautionElement.innerHTML = `
            <div class="precaution-header">
                <span class="precaution-icon">${precaution.icon}</span>
                <h3 class="precaution-title">${precaution.title}</h3>
            </div>
            <ul class="precaution-list">
                ${precaution.precautions.map(item => `<li class="precaution-item">${item}</li>`).join('')}
            </ul>
        `;

        this.precautionsContainer.appendChild(precautionElement);
    }

    injectCSS() {
        const css = `
            .conditional-precautions-container {
                margin: 1rem 0;
                padding: 0;
                display: none;
            }

            .conditional-precaution {
                margin: 1rem 0;
                padding: 1.5rem;
                border-radius: 8px;
                border-left: 5px solid;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                animation: slideInDown 0.3s ease-out;
            }

            .precaution-header {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
            }

            .precaution-icon {
                font-size: 1.5rem;
                margin-right: 0.5rem;
            }

            .precaution-title {
                color: #333;
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .precaution-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .precaution-item {
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                position: relative;
                padding-left: 1.5rem;
            }

            .precaution-item:before {
                content: "•";
                color: inherit;
                font-weight: bold;
                position: absolute;
                left: 0;
            }

            .precaution-item:last-child {
                border-bottom: none;
            }

            /* Specific styling for different alert levels */
            .precaution-moderate-aqi {
                background-color: rgba(255, 255, 0, 0.1);
                border-left-color: #FFD700;
            }

            .precaution-unhealthy-sensitive-aqi {
                background-color: rgba(255, 126, 0, 0.1);
                border-left-color: #FF7E00;
            }

            .precaution-unhealthy-aqi {
                background-color: rgba(255, 0, 0, 0.1);
                border-left-color: #FF0000;
            }

            .precaution-very-unhealthy-aqi {
                background-color: rgba(143, 63, 151, 0.1);
                border-left-color: #8F3F97;
            }

            .precaution-hazardous-aqi {
                background-color: rgba(126, 0, 35, 0.1);
                border-left-color: #7E0023;
                animation: pulse 1s infinite;
            }

            .precaution-pm25-high {
                background-color: rgba(139, 69, 19, 0.1);
                border-left-color: #8B4513;
            }

            .precaution-pm10-high {
                background-color: rgba(105, 105, 105, 0.1);
                border-left-color: #696969;
            }

            .precaution-ozone-high {
                background-color: rgba(30, 144, 255, 0.1);
                border-left-color: #1E90FF;
            }

            .precaution-no2-high {
                background-color: rgba(255, 69, 0, 0.1);
                border-left-color: #FF4500;
            }

            .precaution-so2-high {
                background-color: rgba(255, 20, 147, 0.1);
                border-left-color: #FF1493;
            }

            .precaution-multiple-pollutants {
                background: linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,126,0,0.1));
                border-left-color: #DC143C;
                animation: glow 2s ease-in-out infinite alternate;
            }

            @keyframes slideInDown {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            @keyframes glow {
                from { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                to { box-shadow: 0 4px 16px rgba(220,20,60,0.3); }
            }

            @media (max-width: 768px) {
                .conditional-precaution {
                    margin: 0.5rem 0;
                    padding: 1rem;
                }

                .precaution-title {
                    font-size: 1rem;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    triggerUpdate(healthData) {
        this.updatePrecautions(healthData);
    }

    getActivePrecautions() {
        return Array.from(this.activePrecautions);
    }
}


let conditionalHealthPrecautions;

document.addEventListener('DOMContentLoaded', function() {
    conditionalHealthPrecautions = new ConditionalHealthPrecautions();

    
    document.addEventListener('healthDataUpdated', function(event) {
        conditionalHealthPrecautions.updatePrecautions(event.detail);
    });

    
    if (typeof healthData !== 'undefined') {
        setTimeout(() => {
            conditionalHealthPrecautions.updatePrecautions(healthData);
        }, 1000);
    }
});


window.updateConditionalPrecautions = function(data) {
    if (conditionalHealthPrecautions) {
        conditionalHealthPrecautions.triggerUpdate(data);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConditionalHealthPrecautions;
}
