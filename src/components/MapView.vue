<script setup>
import L from 'leaflet'
import 'leaflet.markercluster'
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  spots: { type: Array, default: () => [] },
  selectedSpotId: { type: String, default: null },
  userPosition: { type: Object, default: null }
})

const emit = defineEmits(['select-spot'])

const mapContainer = ref(null)
let map = null
let markerCluster = null
let markersLayer = null
let userMarker = null

const publicIcon = L.divIcon({
  html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#2563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24]
})

const pourvoirieIcon = L.divIcon({
  html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24]
})

const selectedIcon = L.divIcon({
  html: '<svg width="32" height="32" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: 'custom-marker selected',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
})

function createMarker(feature) {
  const props = feature.properties
  const coords = feature.geometry.coordinates
  const isSelected = props.id === props.selectedSpotId
  const isPourvoirie = props.type === 'pourvoirie'

  const icon = isSelected ? selectedIcon : isPourvoirie ? pourvoirieIcon : publicIcon

  const marker = L.marker([coords[1], coords[0]], { icon })

  marker.bindTooltip(
    `${props.name_fr}${props._distance != null ? ` — ${Math.round(props._distance)} km` : ''}`,
    { direction: 'top', offset: L.point(0, -10) }
  )

  marker.on('click', () => {
    emit('select-spot', props.id)
  })

  return marker
}

function updateMarkers() {
  if (!markerCluster || !map) return
  markerCluster.clearLayers()

  for (const spot of props.spots) {
    const marker = createMarker(spot)
    markerCluster.addLayer(marker)
  }
}

function updateUserMarker() {
  if (!map) return
  if (userMarker) {
    map.removeLayer(userMarker)
    userMarker = null
  }
  if (props.userPosition) {
    userMarker = L.circleMarker([props.userPosition.lat, props.userPosition.lng], {
      radius: 8,
      fillColor: '#6366f1',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map)
    userMarker.bindTooltip('You are here', { direction: 'top' })
  }
}

watch(() => props.spots, updateMarkers, { deep: true })
watch(() => props.userPosition, updateUserMarker)

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: [47.5, -72],
    zoom: 6,
    zoomControl: true
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map)

  markerCluster = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true
  })
  map.addLayer(markerCluster)

  updateMarkers()
})
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
:deep(.custom-marker) {
  background: none;
  border: none;
}
:deep(.custom-marker.selected svg) {
  filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6));
}
</style>
