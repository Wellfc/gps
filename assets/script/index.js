"use strict";

/* Map */

const trackButton = document.querySelector("#track-btn");
const flyButton = document.querySelector("#fly-btn");
let lat, long;

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2VsbGZjIiwiYSI6ImNscTE5azY3eDAzeGwyaXIycTgyMnM0ZW8ifQ.0Bp9MRAu0DmdRpUI8lnDPg";

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-97.143173, 49.895313], // starting position [lng, lat]
  zoom: 4, // starting zoom
  pitch: 40,
  style: "mapbox://styles/mapbox/streets-v12", // style URL
});

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true
  })
);

// map.dragPan.disable();
map.touchZoomRotate.disableRotation();
map.keyboard.disable();
map.scrollZoom.disable();
map.doubleClickZoom.disable();
// map.touchZoomRotate.disable();


function getLocation(position) {
  const { latitude, longitude } = position.coords;
  // console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);

  lat = latitude;
  long = longitude;
  // Center the map on the user's position
  goCenter(latitude, longitude);
  // Create a marker of the user's position on the map
  createMarker(latitude, longitude);
}

// Center the map on the coordinates of the user's position
function goCenter(latitude, longitude) {
  map.flyTo({
    center: [longitude, latitude],
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    zoom: 16,
  });
}

// Store the current marker
let currentMarker = null;

// Create a marker on the map
function createMarker(latitude, longitude) {
  // If a marker already exists, remove it
  if (currentMarker) {
    currentMarker.remove();
  }

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({ offset: 20 }).setText("Mapster");

  // Create a default Marker and add it to the map.
  const marker = new mapboxgl.Marker({
    color: "#0599ff",
    // scale: 0.6,
    rotation: 0,
  })
    .setLngLat([longitude, latitude])
    // .setPopup(popup) // sets a popup on this marker
    .addTo(map);

  // Update the current marker
  currentMarker = marker;
}

// The error/failure callback function
function errorHandler(event) {
  
  console.log(event.message);
}

// Location options
const options = {
  maximumAge: 0, // don't use the cached location
  timeout: 5000,
  enableHighAccuracy: true,
};

// Track button click event handler
if ("geolocation" in navigator) {
    const geo = navigator.geolocation;
    geo.watchPosition(getLocation, errorHandler, options);
  } else {
    alert("Geolocation API is not supported by your browser");
}

flyButton.style.visibility = "visible";

// Fly button click event handler
flyButton.addEventListener("click", () => {
  goCenter(lat, long);
});

