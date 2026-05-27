<script setup>
import { ref, computed } from 'vue'
import { useI18n } from './i18n/index.js'
import { useSpots } from './composables/useSpots.js'
import { useGeolocation } from './composables/useGeolocation.js'
import { useFilters } from './composables/useFilters.js'
import MapView from './components/MapView.vue'
import FilterPanel from './components/FilterPanel.vue'
import SpotCard from './components/SpotCard.vue'
import LangToggle from './components/LangToggle.vue'
import LocateButton from './components/LocateButton.vue'
import AmazonDisclosure from './components/AmazonDisclosure.vue'

const { t, locale } = useI18n()
const { spots, loading, error } = useSpots()
const { userPosition, locating, error: geoError, requestLocation } = useGeolocation()

const {
  selectedSpecies,
  spotType,
  showOutOfSeason,
  allSpecies,
  filteredSpots,
  toggleSpecies,
  setSpotType
} = useFilters(spots, userPosition)

const selectedSpotId = ref(null)
const showFilters = ref(true)

const selectedSpot = computed(() => {
  if (!selectedSpotId.value) return null
  return filteredSpots.value.find(s => s.properties.id === selectedSpotId.value) || null
})

function onSelectSpot(id) {
  selectedSpotId.value = id === selectedSpotId.value ? null : id
}

function onCloseSpot() {
  selectedSpotId.value = null
}

function onLocate() {
  requestLocation()
}

const errorText = computed(() => {
  if (geoError.value) {
    return geoError.value.startsWith('locate.') ? t(geoError.value) : geoError.value
  }
  return null
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">{{ t('app.title') }}</h1>
        <p class="app-subtitle">{{ t('app.subtitle') }}</p>
      </div>
      <div class="header-right">
        <LangToggle />
      </div>
    </header>

    <div class="app-body">
      <aside :class="['sidebar', { collapsed: !showFilters }]">
        <div class="sidebar-toggle" @click="showFilters = !showFilters">
          <span v-if="showFilters">&times;</span>
          <span v-else>&#9776;</span>
        </div>
        <div v-show="showFilters" class="sidebar-content">
          <FilterPanel
            :species="allSpecies"
            :selected-species="selectedSpecies"
            :spot-type="spotType"
            :show-out-of-season="showOutOfSeason"
            @toggle-species="toggleSpecies"
            @set-spot-type="setSpotType"
          />
        </div>
      </aside>

      <main class="main-content">
        <div v-if="loading" class="loading-overlay">
          <div class="spinner-lg"></div>
          <p>{{ t('spot.loading') }}</p>
        </div>
        <div v-else-if="error" class="error-overlay">
          <p>{{ error }}</p>
        </div>
        <div v-else-if="filteredSpots.length === 0 && !loading" class="empty-overlay">
          <p>{{ t('filter.noSpots') }}</p>
        </div>

        <MapView
          :spots="filteredSpots"
          :selected-spot-id="selectedSpotId"
          :user-position="userPosition"
          @select-spot="onSelectSpot"
        />

        <div class="locate-wrapper">
          <LocateButton
            :locating="locating"
            @locate="onLocate"
          />
          <p v-if="errorText" class="geo-error">{{ errorText }}</p>
        </div>

        <SpotCard
          v-if="selectedSpot"
          :spot="selectedSpot"
          @close="onCloseSpot"
        />
      </main>
    </div>

    <AmazonDisclosure />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #1e3a5f;
  color: #fff;
  z-index: 100;
}
.header-left {
  flex: 1;
}
.app-title {
  font-size: 18px;
  font-weight: 700;
}
.app-subtitle {
  font-size: 12px;
  color: #93c5fd;
  margin-top: 2px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-body {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  transition: width 0.2s, min-width 0.2s;
  position: relative;
  z-index: 50;
}
.sidebar.collapsed {
  width: 36px;
  min-width: 36px;
}
.sidebar-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  z-index: 2;
}
.sidebar-toggle:hover {
  background: #f3f4f6;
}
.sidebar-content {
  padding-top: 4px;
}
.main-content {
  flex: 1;
  position: relative;
}
.loading-overlay,
.error-overlay,
.empty-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  border-radius: 8px;
}
.spinner-lg {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.locate-wrapper {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.geo-error {
  font-size: 11px;
  color: #ef4444;
  text-align: center;
  max-width: 250px;
}
</style>
