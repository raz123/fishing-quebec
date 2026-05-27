<script setup>
import { ref } from 'vue'
import { useI18n } from '../i18n/index.js'
import SpeciesPopup from './SpeciesPopup.vue'
import equipmentData from '../../data-src/equipment.json'

const props = defineProps({
  speciesList: { type: Array, default: () => [] }
})

const { t, locale } = useI18n()
const selectedSpecies = ref(null)

function openPopup(species) {
  selectedSpecies.value = species
}

function closePopup() {
  selectedSpecies.value = null
}
</script>

<template>
  <div class="species-list">
    <div
      v-for="species in speciesList"
      :key="species.fr"
      class="species-card"
    >
      <div class="species-header" @click="openPopup(species)" role="button" tabindex="0" @keydown.enter="openPopup(species)" @keydown.space.prevent="openPopup(species)">
        <span class="species-name">{{ locale === 'fr' ? species.fr : species.en }}</span>
        <span class="species-latin">{{ species.latin }}</span>
        <svg class="click-hint" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
    </div>

    <div v-if="speciesList.length === 0" class="empty-state">
      {{ t('spot.selectPrompt') }}
    </div>

    <SpeciesPopup
      v-if="selectedSpecies"
      :species="selectedSpecies"
      :data="equipmentData[selectedSpecies.fr] || null"
      @close="closePopup"
    />
  </div>
</template>

<style scoped>
.species-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.species-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: all var(--transition-fast);
}
.species-card:hover {
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}
.species-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background var(--transition-fast);
  user-select: none;
  border-radius: var(--radius-md);
}
.species-header:hover {
  background: var(--color-bg);
}
.species-header:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}
.species-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
}
.species-latin {
  font-style: italic;
  font-size: 11px;
  color: var(--color-text-secondary);
  flex: 1;
}
.click-hint {
  color: var(--color-text-secondary);
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity var(--transition-fast);
}
.species-card:hover .click-hint {
  opacity: 0.8;
}
.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 13px;
  padding: 24px;
}
</style>
