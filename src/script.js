// Initialize the map
const map = L.map('map').setView([42.3134, -71.0389], 16);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Routing Control
let startPoint = null;
let endPoint = null;
let travelMode = 'foot'; // Default travel mode

const routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    router: L.Routing.osrmv1({
        profile: travelMode // Travel mode: walking or driving
    }),
    lineOptions: {
        styles: [{ color: 'blue', weight: 4 }]
    }
}).addTo(map);

// Variables to control setting points
let settingStart = false;
let settingEnd = false;

// Buttons to set start and end points
document.getElementById('set-start').addEventListener('click', () => {
    settingStart = true;
    settingEnd = false;
    alert('Click on a marker to set the Start Point.');
});

document.getElementById('set-end').addEventListener('click', () => {
    settingStart = false;
    settingEnd = true;
    alert('Click on a marker to set the End Point.');
});

// Load GeoJSON for predefined points
fetch('./campus-points.geojson')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON points to the map
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // Create markers for each GeoJSON point
                return L.marker(latlng);
            },
            onEachFeature: function(feature, layer) {
                const buildingName = feature.properties.name;

                // Add tooltip to display name on hover
                layer.bindTooltip(buildingName, {
                    permanent: false, // Only show on hover
                    direction: 'top', // Tooltip position
                    className: 'custom-tooltip' // Optional custom class
                });

                // Bind a popup for clicking
                layer.bindPopup(`<b>${buildingName}</b><br>Click to set as Start or End Point.`);
            }
        }).addTo(map);
    })
    .catch(err => console.error('Error loading GeoJSON:', err));

// Update the route whenever waypoints or travel mode changes
function updateRoute() {
    if (startPoint && endPoint) {
        routingControl.setWaypoints([startPoint, endPoint]);
        routingControl.getRouter().options.profile = travelMode;
        routingControl.route();
    }
}

// Handle travel mode changes
document.getElementById('travel-mode').addEventListener('change', (e) => {
    travelMode = e.target.value;
    updateRoute();
});
