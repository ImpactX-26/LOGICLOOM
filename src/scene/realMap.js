import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VOLCANOES, activeVolcano, setActiveVolcano } from '../core/volcanoData.js'
import { S, V, hooks, lvl } from '../core/data.js'
import { D, tele } from '../core/world.js'

let mapInstance = null
let currentLayer = 'satellite'
let tileLayer = null
let volcanoMarkers = []
let stationMarkers = []
let hazardZones = []
let droneMarker = null
let flightPathLine = null
let userMarker = null
let animFrameId = null

const TILES = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attrib: 'Tiles &copy; Esri &mdash; Earthstar Geographics'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attrib: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
  }
}

export function initRealMap(containerEl) {
  if (!containerEl) return
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }

  // Initialize Leaflet Map centered on active volcano
  const [lat, lng] = activeVolcano.coords
  mapInstance = L.map(containerEl, {
    center: [lat, lng],
    zoom: 12,
    zoomControl: false,
    attributionControl: false
  })

  // Add tile layer
  tileLayer = L.tileLayer(TILES[currentLayer].url, {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(mapInstance)

  // Add scale control
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(mapInstance)

  // Render map layers
  renderVolcanoMarkers()
  renderActiveVolcanoLayers()
  initDroneTracking()

  return mapInstance
}

export function setMapTileLayer(type) {
  if (!mapInstance || currentLayer === type) return
  currentLayer = type
  if (tileLayer) mapInstance.removeLayer(tileLayer)
  tileLayer = L.tileLayer(TILES[type].url, {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(mapInstance)
}

export function flyToVolcano(volcanoId) {
  const v = setActiveVolcano(volcanoId)
  if (!mapInstance || !v) return
  mapInstance.flyTo(v.coords, 12, { duration: 1.5 })
  renderActiveVolcanoLayers()
  if (hooks.refresh) hooks.refresh()
  if (hooks.ui) hooks.ui()
}

export function flyToUserLocation(onSuccess, onError) {
  if (!navigator.geolocation) {
    if (onError) onError('Geolocation is not supported by your browser.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      if (mapInstance) {
        mapInstance.flyTo([lat, lng], 13, { duration: 1.8 })
        if (userMarker) mapInstance.removeLayer(userMarker)
        userMarker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#38bdf8',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(mapInstance).bindPopup(`<b>My Location</b><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`).openPopup()
      }
      if (onSuccess) onSuccess([lat, lng])
    },
    (err) => {
      let msg = 'Location access unavailable.'
      if (err.code === err.PERMISSION_DENIED) {
        msg = 'Location permission denied by user.'
      }
      if (onError) onError(msg)
    },
    { timeout: 8000, enableHighAccuracy: true }
  )
}

function renderVolcanoMarkers() {
  if (!mapInstance) return
  volcanoMarkers.forEach(m => mapInstance.removeLayer(m))
  volcanoMarkers = []

  VOLCANOES.forEach(v => {
    const isCurrent = v.id === activeVolcano.id
    const iconHtml = `
      <div class="real-volcano-marker ${isCurrent ? 'active-volcano' : ''}" style="cursor:pointer">
        <div class="marker-dot">▲</div>
        <div class="marker-tag">
          <b>${v.name}</b>
          <small>${v.country}</small>
        </div>
      </div>
    `
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'vz-custom-div-icon',
      iconSize: [120, 42],
      iconAnchor: [60, 20]
    })

    const m = L.marker(v.coords, { icon: customIcon }).addTo(mapInstance)
    m.on('click', () => {
      flyToVolcano(v.id)
    })
    volcanoMarkers.push(m)
  })
}

export function renderActiveVolcanoLayers() {
  if (!mapInstance) return

  // Clear previous stations and hazard buffers
  stationMarkers.forEach(m => mapInstance.removeLayer(m))
  stationMarkers = []
  hazardZones.forEach(z => mapInstance.removeLayer(z))
  hazardZones = []

  const [vLat, vLng] = activeVolcano.coords

  // Render Hazard Zones (Zone A: 4km, Zone B: 10km, Zone C: 22km)
  const zoneA = L.circle([vLat, vLng], {
    radius: 4000,
    color: '#f43f5e',
    fillColor: '#f43f5e',
    fillOpacity: 0.18,
    weight: 2,
    dashArray: '4, 4'
  }).addTo(mapInstance).bindTooltip('ZONE A · Inner Exclusion (4 km)', { sticky: true, className: 'vz-tooltip' })

  const zoneB = L.circle([vLat, vLng], {
    radius: 10000,
    color: '#f59e0b',
    fillColor: '#f59e0b',
    fillOpacity: 0.08,
    weight: 1.5,
    dashArray: '6, 6'
  }).addTo(mapInstance).bindTooltip('ZONE B · Evacuation Planning (10 km)', { sticky: true, className: 'vz-tooltip' })

  const zoneC = L.circle([vLat, vLng], {
    radius: 22000,
    color: '#38bdf8',
    fillColor: '#38bdf8',
    fillOpacity: 0.04,
    weight: 1
  }).addTo(mapInstance).bindTooltip('ZONE C · Regional Monitoring (22 km)', { sticky: true, className: 'vz-tooltip' })

  hazardZones.push(zoneA, zoneB, zoneC)

  // Render Stations
  activeVolcano.stations.forEach(st => {
    const sLat = vLat + st.offset[0]
    const sLng = vLng + st.offset[1]
    const currentLvl = lvl(st.type)
    const statusCol = ['#34d399', '#fbbf24', '#f43f5e'][currentLvl] || '#38bdf8'

    const stHtml = `
      <div class="real-station-pin" style="--st-col:${statusCol}">
        <div class="pin-pulse"></div>
        <div class="pin-core"></div>
        <div class="pin-label">${st.name}</div>
      </div>
    `
    const icon = L.divIcon({
      html: stHtml,
      className: 'vz-station-icon',
      iconSize: [110, 30],
      iconAnchor: [10, 10]
    })

    const sm = L.marker([sLat, sLng], { icon }).addTo(mapInstance)
    sm.on('click', () => {
      V.SEL = { t: 'st', id: st.id }
      if (hooks.ui) hooks.ui()
    })
    stationMarkers.push(sm)
  })

  // Drone Base Marker
  const baseLat = vLat + activeVolcano.droneBaseOffset[0]
  const baseLng = vLng + activeVolcano.droneBaseOffset[1]
  const baseIcon = L.divIcon({
    html: `<div class="real-station-pin" style="--st-col:#38bdf8"><div class="pin-core"></div><div class="pin-label">Drone Base</div></div>`,
    className: 'vz-station-icon',
    iconSize: [90, 24],
    iconAnchor: [8, 8]
  })
  const baseMarker = L.marker([baseLat, baseLng], { icon: baseIcon }).addTo(mapInstance)
  stationMarkers.push(baseMarker)

  // Target Zone A Marker
  const targetLat = vLat + activeVolcano.targetZoneOffset[0]
  const targetLng = vLng + activeVolcano.targetZoneOffset[1]
  const targetIcon = L.divIcon({
    html: `<div class="real-station-pin" style="--st-col:#fbbf24"><div class="pin-pulse"></div><div class="pin-core"></div><div class="pin-label">Gas Zone A (Target)</div></div>`,
    className: 'vz-station-icon',
    iconSize: [120, 24],
    iconAnchor: [8, 8]
  })
  const targetMarker = L.marker([targetLat, targetLng], { icon: targetIcon }).addTo(mapInstance)
  stationMarkers.push(targetMarker)

  // Highlight active volcano in markers list
  renderVolcanoMarkers()
}

function initDroneTracking() {
  if (animFrameId) cancelAnimationFrame(animFrameId)

  function updateDrone() {
    if (!mapInstance) return
    const [vLat, vLng] = activeVolcano.coords
    const baseLat = vLat + activeVolcano.droneBaseOffset[0]
    const baseLng = vLng + activeVolcano.droneBaseOffset[1]
    const targetLat = vLat + activeVolcano.targetZoneOffset[0]
    const targetLng = vLng + activeVolcano.targetZoneOffset[1]

    // Interpolate drone coordinates from D.fp (0 to 1) or simulation state
    const progress = Math.max(0, Math.min(1, D.fp || (S.mn ? 0.35 : 0)))
    const dLat = baseLat + (targetLat - baseLat) * progress
    const dLng = baseLng + (targetLng - baseLng) * progress

    if (S.mn) {
      if (!droneMarker) {
        const droneIcon = L.divIcon({
          html: `<div class="live-drone-leaflet-icon"><div class="drone-radar"></div><div class="drone-symbol">🛸</div><div class="drone-tag">DRONE-01 · In Flight</div></div>`,
          className: 'vz-drone-icon',
          iconSize: [130, 40],
          iconAnchor: [20, 20]
        })
        droneMarker = L.marker([dLat, dLng], { icon: droneIcon }).addTo(mapInstance)
      } else {
        droneMarker.setLatLng([dLat, dLng])
      }

      // Draw flight line
      if (!flightPathLine) {
        flightPathLine = L.polyline([[baseLat, baseLng], [targetLat, targetLng]], {
          color: '#38e8ff',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.85
        }).addTo(mapInstance)
      } else {
        flightPathLine.setLatLngs([[baseLat, baseLng], [targetLat, targetLng]])
      }
    } else {
      if (droneMarker) {
        mapInstance.removeLayer(droneMarker)
        droneMarker = null
      }
      if (flightPathLine) {
        mapInstance.removeLayer(flightPathLine)
        flightPathLine = null
      }
    }

    animFrameId = requestAnimationFrame(updateDrone)
  }

  animFrameId = requestAnimationFrame(updateDrone)
}

export function cleanupRealMap() {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
}
