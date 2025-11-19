// 1. Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGhpbGlwa2xlZW1hbm4yIiwiYSI6ImNtaDU3MGh0djAydjYybnBtZGRqODBxYzEifQ.Gm9MNfRsoFJpxa7vl8SSbA';

// 2. Create the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  zoom: 11, // starting zoom
  center: [-122.3328, 47.6061] // starting center
  
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
    data: 'assets/Public_Garages_and_Parking_Lots.geojson'  // <-- replace with your dataset path or URL
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

  // EXAMPLE: popup on click
  map.on('click', 'museums-layer', (e) => {
    const props = e.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <strong>${props.name || 'Feature'}</strong><br>
        ${props.description || ''}
      `)
      .addTo(map);
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
    <p><strong>Address:</strong> ${props.address}</p>
    <p>${props.description || ""}</p>
  `;

  document.getElementById('museum-content').innerHTML = html;
});

