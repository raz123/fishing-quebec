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
      <div class="species-header" @click="openPopup(species)" role="button" tabindex="0">
        <span class="species-name">{{ locale === 'fr' ? species.fr : species.en }}</span>
        <span class="species-latin">{{ species.latin }}</span>
        <span class="click-hint">&#9432;</span>
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}
.species-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
}
.species-header:hover {
  background: #e5e7eb;
}
.species-header:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  border-radius: 8px;
}
.species-name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}
.species-latin {
  font-style: italic;
  font-size: 11px;
  color: #9ca3af;
  flex: 1;
}
.click-hint {
  font-size: 14px;
  color: #9ca3af;
  opacity: 0.6;
}
.empty-state {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  padding: 24px;
}
</style>
