<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { useBitingNow } from '../composables/useBitingNow.js'
import SpeciesPopup from './SpeciesPopup.vue'
import equipmentData from '../../data-src/equipment.json'

const props = defineProps({
  speciesList: { type: Array, default: () => [] }
})

const { t, locale } = useI18n()
const { isBitingNow } = useBitingNow()
const selectedSpecies = ref(null)

const sortedSpecies = computed(() => {
  return [...props.speciesList].sort((a, b) => {
    const aBiting = isBitingNow(a.fr) ? 1 : 0
    const bBiting = isBitingNow(b.fr) ? 1 : 0
    return bBiting - aBiting
  })
})

const bitingCount = computed(() => {
  return props.speciesList.filter(s => isBitingNow(s.fr)).length
})

function openPopup(species) {
  selectedSpecies.value = species
}

function closePopup() {
  selectedSpecies.value = null
}
</script>

<template>
  <div class="species-list">
    <div v-if="bitingCount > 0" class="biting-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="3"/></svg>
      <span>{{ locale === 'fr' ? `${bitingCount} espèces mordent maintenant` : `${bitingCount} species biting now` }}</span>
    </div>
    <div
      v-for="species in sortedSpecies"
      :key="species.fr"
      :class="['species-card', { biting: isBitingNow(species.fr) }]"
    >
      <div class="species-header" @click="openPopup(species)" role="button" tabindex="0" @keydown.enter="openPopup(species)" @keydown.space.prevent="openPopup(species)">
        <span class="species-name">{{ locale === 'fr' ? species.fr : species.en }}</span>
        <span class="species-latin">{{ species.latin }}</span>
        <span v-if="isBitingNow(species.fr)" class="biting-badge">{{ locale === 'fr' ? 'Actif' : 'Active' }}</span>
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
.biting-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
  border: 1px solid #BBF7D0;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: #065F46;
  margin-bottom: 4px;
}
.biting-banner svg {
  color: var(--color-success);
  flex-shrink: 0;
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
.species-card.biting {
  border-color: #BBF7D0;
  background: linear-gradient(135deg, #FAFFFB, #F0FDF4);
}
.species-card.biting:hover {
  border-color: var(--color-success);
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
  background: rgba(0,0,0,0.02);
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
.biting-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  background: #BBF7D0;
  color: #065F46;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  animation: pulse-badge 2s infinite;
}
@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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
