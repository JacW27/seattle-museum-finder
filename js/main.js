// 1. Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoidm9ydGV4NyIsImEiOiJjbWhkdDc4cDUwNzJnMnRwcnd5Z21oYzJiIn0.H1LmCQc2KJuXvjfBiJQlaw';

// 2. Create the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  zoom: 13, // starting zoom (closer to campus)
  center: [-122.3035, 47.6553] // starting center (UW Seattle Campus)
  
});

// Create constants to use in getIso()
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
// UW Seattle Campus coordinates (approximate)
const lon = -122.3035;
const lat = 47.6553;
let profile = 'cycling'; // Set the default routing profile
let minutes = 10; // Set the default duration

// Create a function that sets up the Isochrone API query then makes an fetch call
async function getIso() {
  const query = await fetch(
    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const data = await query.json();
  // Set the 'iso' source's data to what's returned by the API query
  map.getSource('iso').setData(data);
}

const marker = new mapboxgl.Marker({
  color: '#314ccd'
});

// Create a LngLat object to use in the marker initialization
// https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
const lngLat = {
  lon: lon,
  lat: lat
};
// Call the getIso function
// You will remove this later - it's just here so you can see the console.log results in this step
map.on('load', () => {
  // Initialize the marker at the query coordinates
  marker.setLngLat(lngLat).addTo(map);
  // When the map loads, add the source and layer
  map.addSource('iso', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer(
    {
      id: 'isoLayer',
      type: 'fill',
      // Use "iso" as the data source for this layer
      source: 'iso',
      layout: {},
      paint: {
        // The fill color for the layer is set to a light purple
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3
      }
    },
    'poi-label'
  );

  // Make the API call
  getIso();
});

// NOTE: runtime sizing override removed — CSS `.map-wrapper` controls the map size now.

// Target the "params" form in the HTML portion of your code
const params = document.getElementById('params');

// When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', (event) => {
  if (event.target.name === 'profile') {
    profile = event.target.value;
  } else if (event.target.name === 'duration') {
    minutes = event.target.value;
  }
  getIso();
});

// 3. Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// 4. Load layers after the map is ready
map.on('load', () => {

  // EXAMPLE: Add a GeoJSON dataset
  map.addSource('museums', {
    type: 'geojson',
    data: 'assets/museums.geojson'  // <-- replace with your dataset path or URL
  });

  map.addLayer({
    id: 'museums-layer',
    type: 'circle',
    source: 'museums',
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff5500',
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1
    }
  });

    // EXAMPLE: Add Public_Garages_and_Parking_Lots dataset
  map.addSource('public_garages', {
    type: 'geojson',
    data: 'assets/Public_Garages_and_Parking_Lots_0.25mi.geojson'
  });

  map.addLayer({
    id: 'public_garages-layer',
    type: 'circle',
    source: 'public_garages',
    paint: {
      'circle-radius': 6,
      'circle-color': 'rgba(0, 42, 255, 1)',
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1
    }
  });

  // On click: write museum details to the external sidebar (`#museum-content`) instead of a popup
  map.on('click', 'museums-layer', (e) => {
    if (!e.features || !e.features.length) return;
    const props = e.features[0].properties;

    let html = `
      <h3>${props.name || 'Feature'}</h3>
    `;

    if (props.image) {
      html += `<div><img src="${props.image}" alt="${props.name || ''}"></div>`;
    }
    if (props.address) {
      html += `<div><strong>Address:</strong> ${props.address || 'N/A'}</div>`;
    }
    if (props.website) {
      html += `<div><a href="${props.website}">Website</a></div>`;
    }

    if (props.hours) {
      html += `<div><strong>Hours:</strong> ${props.hours}</div>`;
    }

    if (props.description) {
      html += `<div>${props.description || ''}</div>`;
    }

    const container = document.getElementById('museum-content');
    if (container) {
      container.innerHTML = html;
      const info = document.getElementById('museum-info');
      if (info) info.style.display = '';
    }

    // Optional: keep the clicked location visible by easing the map center
    // map.easeTo({ center: e.lngLat });
  });

  map.on('mouseenter', 'museums-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'museums-layer', () => {
    map.getCanvas().style.cursor = '';
  });

});

map.on('mousemove', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['museums-layer']  // <-- your museum layer ID
  });

  if (!features.length) {
    document.getElementById('museum-content').innerHTML =
      `<p>Hover over a museum!</p>`;
    return;
  }

  const props = features[0].properties;

  // museum properties you must have:
  // props.name
  // props.image
  // props.address
  // props.description

  let html = `
    <h3>${props.name}</h3>
  `;

  if (props.image) {
    html += `<img src="${props.image}" alt="${props.name}">`;
  }

  html += `
    <div><strong>Address:</strong> ${props.address}</div>
    <div><a href="${props.website}">Website</a></div>
    <div><strong>Hours: </strong>${props.hours || ""}</div>
  `;

  document.getElementById('museum-content').innerHTML = html;
});

