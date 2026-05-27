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
const sidebarOpen = ref(false)

function filterToggle() {
  if (window.innerWidth < 768) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    showFilters.value = !showFilters.value
  }
}

function closeSidebar() {
  sidebarOpen.value = false
}

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
        <button class="mobile-filter-btn" @click="filterToggle" aria-label="Toggle filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="18" r="1.5" fill="currentColor"/></svg>
        </button>
        <LangToggle />
      </div>
    </header>

    <div class="app-body">
      <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeSidebar"></div>
      <aside :class="['sidebar', { collapsed: !showFilters, open: sidebarOpen }]">
        <div class="sidebar-toggle" @click="filterToggle" role="button" tabindex="0">
          <svg v-if="showFilters || sidebarOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>
        <div v-show="showFilters || sidebarOpen" class="sidebar-content">
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
:root {
  --color-primary: #0EA5E9;
  --color-primary-hover: #0284C7;
  --color-secondary: #38BDF8;
  --color-cta: #F97316;
  --color-cta-hover: #EA580C;
  --color-bg: #F0F9FF;
  --color-surface: #FFFFFF;
  --color-text: #0C4A6E;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-success: #059669;
  --color-success-light: #D1FAE5;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
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
  padding: 12px 20px;
  background: linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 100%);
  color: #fff;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header-left {
  flex: 1;
}
.app-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.app-subtitle {
  font-size: 12px;
  color: rgba(255,255,255,0.75);
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
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  transition: width var(--transition-base), min-width var(--transition-base);
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
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  z-index: 2;
  transition: all var(--transition-fast);
}
.sidebar-toggle:hover {
  background: var(--color-bg);
  color: var(--color-text);
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
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 28px 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.spinner-lg {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
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
.mobile-filter-btn {
  display: none;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 6px;
  color: #fff;
  line-height: 0;
  transition: all var(--transition-fast);
}
.mobile-filter-btn:hover {
  background: rgba(255,255,255,0.3);
}
.sidebar-backdrop {
  display: none;
}
@media (max-width: 767px) {
  .mobile-filter-btn {
    display: flex;
    align-items: center;
  }
  .app-header {
    padding: 10px 12px;
  }
  .app-title {
    font-size: 15px;
  }
  .app-subtitle {
    display: none;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    min-width: 280px;
    height: 100vh;
    z-index: 200;
    transition: left var(--transition-base);
    box-shadow: var(--shadow-lg);
    border-right: none;
  }
  .sidebar.open {
    left: 0;
  }
  .sidebar.collapsed {
    width: 280px;
    min-width: 280px;
  }
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 150;
  }
  .sidebar-toggle {
    top: 12px;
    right: 12px;
  }
  .locate-wrapper {
    bottom: 16px;
  }
}
</style>
