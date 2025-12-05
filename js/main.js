// 1. Setting up the access token for MapBox GL JS
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FpYmEyayIsImEiOiJjbWh0aXlybGowb3VvMmxvanBhaDB6YThlIn0.bbZi9GXBCsrDH2M4bUWFMQ';

// 2. Create the map
const map = new mapboxgl.Map({
  container: 'map',
  // Style URL for Kai's Custom Basemap
  style: 'mapbox://styles/kaiba2k/cmidh7iz4006w01sv5ccb81rj',
  zoom: 13, // starting zoom (closer to campus)
  center: [-122.3035, 47.6553] // starting center (UW Seattle Campus)
  
});

// Directions control: will allow users to route to selected museums
// Keep a fixed origin for routing (UW Seattle Campus) so users route from campus
const ROUTE_ORIGIN = [-122.3035, 47.6553];
let directions;
// current origin used for isochrone center; initialize to the campus origin
let CURRENT_ORIGIN = ROUTE_ORIGIN.slice();
// instantiate directions control after map creation
if (typeof MapboxDirections !== 'undefined') {
  directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'imperial',
    profile: 'mapbox/driving',
    alternatives: false,
    controls: { instructions: true }
  });
  map.addControl(directions, 'top-left');

  // Helper: check whether the directions origin is equal to our default ROUTE_ORIGIN
  function originEqualsRouteOrigin() {
    try {
      if (!directions || typeof directions.getOrigin !== 'function') return false;
      const o = directions.getOrigin();
      if (!o) return false;
      // `o` may be a Feature-like object or an array; extract coordinates robustly
      let coords = null;
      if (Array.isArray(o) && o.length >= 2) coords = o;
      else if (o.geometry && Array.isArray(o.geometry.coordinates)) coords = o.geometry.coordinates;
      else if (o.lng && o.lat) coords = [o.lng, o.lat];
      if (!coords) return false;
      return Math.abs(coords[0] - ROUTE_ORIGIN[0]) < 1e-6 && Math.abs(coords[1] - ROUTE_ORIGIN[1]) < 1e-6;
    } catch (err) {
      return false;
    }
  }

  // Try to detect when the user edits the origin input so we won't overwrite it later.
  // The Directions control builds inputs asynchronously; attach listeners after a short delay.
  setTimeout(() => {
    try {
      // common class names used by the plugin — attach to any matching inputs
      const originInput = document.querySelector('.mapbox-directions-origin input, .mapbox-directions__origin input, .mapbox-directions-origin');
      if (originInput) {
        const inputEl = originInput.tagName === 'INPUT' ? originInput : originInput.querySelector('input');
        if (inputEl) {
          inputEl.addEventListener('input', () => {
            // no-op; the check uses directions.getOrigin() when deciding to overwrite
          });
          inputEl.addEventListener('change', () => {});
        }
      }
      // also listen to events emitted by the plugin if available
      if (directions && typeof directions.on === 'function') {
        try {
          directions.on('origin', () => {
            // When the origin is changed in the Directions UI, update the CURRENT_ORIGIN,
            // move the marker, and refresh the isochrone centered on the new origin.
            try {
              const o = directions.getOrigin && directions.getOrigin();
              if (!o) return;
              let coords = null;
              if (Array.isArray(o) && o.length >= 2) coords = [o[0], o[1]];
              else if (o.geometry && Array.isArray(o.geometry.coordinates)) coords = [o.geometry.coordinates[0], o.geometry.coordinates[1]];
              else if (o.lng && o.lat) coords = [o.lng, o.lat];
              if (coords) {
                CURRENT_ORIGIN = coords.slice();
                marker.setLngLat(CURRENT_ORIGIN).addTo(map);
                // refresh isochrone for the new origin
                getIso(CURRENT_ORIGIN[0], CURRENT_ORIGIN[1]);
              }
            } catch (err) {
              // ignore
            }
          });
        } catch (e) {}
        try {
          directions.on('clear', () => {
            // If the directions are cleared, reset current origin to campus and refresh
            CURRENT_ORIGIN = ROUTE_ORIGIN.slice();
            marker.setLngLat(CURRENT_ORIGIN).addTo(map);
            getIso(CURRENT_ORIGIN[0], CURRENT_ORIGIN[1]);
          });
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }, 500);
}

// Create constants to use in getIso()
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
// UW Seattle Campus coordinates (approximate) — make mutable so clicks can update origin
let lon = ROUTE_ORIGIN[0];
let lat = ROUTE_ORIGIN[1];
let profile = 'cycling'; // Set the default routing profile
let minutes = 10; // Set the default duration

// Create a function that sets up the Isochrone API query then makes an fetch call
// getIso: fetch isochrone for a given lon/lat (defaults to current `lon`/`lat`)
async function getIso(lonArg = CURRENT_ORIGIN[0], latArg = CURRENT_ORIGIN[1]) {
  const query = await fetch(
    `${urlBase}${profile}/${lonArg},${latArg}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const data = await query.json();
  // Set the 'iso' source's data to what's returned by the API query
  map.getSource('iso').setData(data);
}

const marker = new mapboxgl.Marker({
  color: '#314ccd'
});

// https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
// marker will be positioned using an array [lon, lat]
map.on('load', () => {
  // Initialize the marker at the current origin
  marker.setLngLat([CURRENT_ORIGIN[0], CURRENT_ORIGIN[1]]).addTo(map);
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

  // Ensure the isochrone fill is rendered beneath the point layers so markers are visible
  try {
    if (map.getLayer('isoLayer') && map.getLayer('public_garages-layer')) {
      map.moveLayer('isoLayer', 'public_garages-layer');
    }
  } catch (err) {
    // ignore if layers not found yet
    console.warn('Could not move isoLayer:', err);
  }

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

    // Get clicked museum coordinates (we do NOT change isochrone origin here)
    const coords = e.features[0].geometry.coordinates;
    const clickedLon = coords[0];
    const clickedLat = coords[1];
    // If directions control is available, set destination to clicked museum.
    // Only overwrite the origin if it currently equals the default ROUTE_ORIGIN (i.e. the user hasn't entered a custom origin).
    if (typeof directions !== 'undefined') {
      try {
        if (originEqualsRouteOrigin()) {
          directions.setOrigin(ROUTE_ORIGIN);
          // also ensure CURRENT_ORIGIN is set to ROUTE_ORIGIN when we programmatically set it
          CURRENT_ORIGIN = ROUTE_ORIGIN.slice();
          marker.setLngLat([CURRENT_ORIGIN[0], CURRENT_ORIGIN[1]]).addTo(map);
          getIso(CURRENT_ORIGIN[0], CURRENT_ORIGIN[1]);
        }
        directions.setDestination([clickedLon, clickedLat]);
      } catch (err) {
        console.warn('Directions control error:', err);
      }
    }
    // Optional: keep the clicked location visible by easing the map center
    // map.easeTo({ center: [clickedLon, clickedLat] });
  });

  map.on('mouseenter', 'museums-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'museums-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  // Make garages clickable: set directions destination to clicked garage and show a popup
  map.on('click', 'public_garages-layer', (e) => {
    if (!e.features || !e.features.length) return;
    const feat = e.features[0];
    const coords = feat.geometry.coordinates;
    const destLon = coords[0];
    const destLat = coords[1];

    // Update Directions destination without overwriting a user-entered origin
    if (typeof directions !== 'undefined') {
      try {
        // determine whether current origin equals default campus origin
        let originIsCampus = false;
        try {
          const o = directions.getOrigin && directions.getOrigin();
          if (o) {
            let oc = null;
            if (Array.isArray(o) && o.length >= 2) oc = o;
            else if (o.geometry && Array.isArray(o.geometry.coordinates)) oc = o.geometry.coordinates;
            else if (o.lng && o.lat) oc = [o.lng, o.lat];
            if (oc) {
              originIsCampus = Math.abs(oc[0] - ROUTE_ORIGIN[0]) < 1e-6 && Math.abs(oc[1] - ROUTE_ORIGIN[1]) < 1e-6;
            }
          }
        } catch (e) {}

        if (originIsCampus) directions.setOrigin(ROUTE_ORIGIN);
        directions.setDestination([destLon, destLat]);
      } catch (err) {
        console.warn('Directions control error (garage):', err);
      }
    }

    // Small popup with basic garage info (if available)
    let popupHtml = '<strong>Garage</strong>';
    if (feat.properties) {
      const p = feat.properties;
      if (p.FAC_NAME) popupHtml = `<strong>${p.FAC_NAME}</strong>`;
      if (p.DEA_FACILITY_ADDRESS) popupHtml += `<div>${p.DEA_FACILITY_ADDRESS}</div>`;
      if (p.DEA_STALLS) popupHtml += `<div>Spots: ${p.DEA_STALLS}</div>`;
    }
    new mapboxgl.Popup({ offset: 12 }).setLngLat([destLon, destLat]).setHTML(popupHtml).addTo(map);
  });

  map.on('mouseenter', 'public_garages-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'public_garages-layer', () => { map.getCanvas().style.cursor = ''; });

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
