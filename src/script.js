// Initialize the map
const map = L.map('map').setView([42.3134, -71.0420], 16);

// Add Tile Layers
const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
const satelliteLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
streetLayer.addTo(map); // Default Layer

// Layer Control
L.control.layers({ 'Street View': streetLayer, 'Satellite View': satelliteLayer }).addTo(map);

// Add GeoJSON Data
fetch('campus-data.geojson') // Update the path if necessary
    .then(response => response.json())
    .then(data => L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(`<b>${feature.properties.name}</b>`);
            }
        }
    }).addTo(map));

// Add Search Functionality
L.Control.geocoder().addTo(map);

// Routing Machine for Directions
let startPoint = null;
let endPoint = null;

const routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    showAlternatives: true,
    geocoder: L.Control.Geocoder.nominatim() // Optional: Address search for waypoints
}).addTo(map);

// Click Event for Setting Start and End Points
map.on('click', function (e) {
    if (!startPoint) {
        startPoint = e.latlng;
        L.marker(startPoint).addTo(map).bindPopup('Start Point').openPopup();
    } else if (!endPoint) {
        endPoint = e.latlng;
        L.marker(endPoint).addTo(map).bindPopup('End Point').openPopup();

        // Update Routing Control with Start and End Points
        routingControl.setWaypoints([startPoint, endPoint]);
    } else {
        // Reset Route
        startPoint = null;
        endPoint = null;
        routingControl.setWaypoints([]);
        alert('Route reset! Click to set new points.');
    }
});
