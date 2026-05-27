<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import SpeciesList from './SpeciesList.vue'

const props = defineProps({
  spot: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const { t, locale } = useI18n()

const spotName = computed(() => {
  if (!props.spot) return ''
  return locale.value === 'fr'
    ? props.spot.properties.name_fr
    : props.spot.properties.name_en
})

const spotType = computed(() => {
  if (!props.spot) return ''
  return props.spot.properties.type === 'pourvoirie' ? 'Pourvoirie' : 'Public'
})

const formattedSeason = computed(() => {
  if (!props.spot?.properties.season) return ''
  const s = props.spot.properties.season
  const parts = s.split(' - ')
  if (parts.length !== 2) return s
  const fmt = (iso) => {
    if (!iso || iso === '?') return '?'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString(locale.value === 'fr' ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return `${fmt(parts[0])} - ${fmt(parts[1])}`
})
</script>

<template>
  <div v-if="spot" class="spot-card">
    <div class="card-header">
      <h2 class="card-title">{{ spotName }}</h2>
      <button class="close-btn" @click="$emit('close')" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="card-meta">
      <span :class="['type-badge', spot.properties.type]">{{ spotType }}</span>
      <span v-if="spot.properties.milieu" class="meta-item">{{ spot.properties.milieu }}</span>
      <span v-if="spot.properties.region" class="meta-item">{{ spot.properties.region }}</span>
      <span v-if="spot.properties._distance != null" class="meta-item distance">
        {{ Math.round(spot.properties._distance) }} km
      </span>
    </div>

    <div v-if="spot.properties.address" class="info-row">
      <span class="info-label">{{ t('spot.address') }}:</span>
      <span class="info-value">{{ spot.properties.address }}</span>
    </div>

    <div v-if="spot.properties.type === 'pourvoirie'" class="contact-info">
      <div v-if="spot.properties.phone" class="info-row">
        <span class="info-label">{{ t('spot.phone') }}:</span>
        <a :href="'tel:' + spot.properties.phone" class="info-value link">{{ spot.properties.phone }}</a>
      </div>
      <div v-if="spot.properties.email" class="info-row">
        <span class="info-label">{{ t('spot.email') }}:</span>
        <a :href="'mailto:' + spot.properties.email" class="info-value link">{{ spot.properties.email }}</a>
      </div>
      <div v-if="spot.properties.website" class="info-row">
        <span class="info-label">{{ t('spot.website') }}:</span>
        <a :href="spot.properties.website" target="_blank" rel="noopener" class="info-value link">{{ spot.properties.website }}</a>
      </div>
      <div v-if="formattedSeason" class="info-row">
        <span class="info-label">{{ t('spot.season') }}:</span>
        <span class="info-value">{{ formattedSeason }}</span>
      </div>
    </div>

    <div class="species-section">
      <h3 class="section-header">{{ t('spot.species') }} ({{ (spot.properties.species || []).length }})</h3>
      <SpeciesList
        :species-list="spot.properties.species || []"
      />
    </div>
  </div>
</template>

<style scoped>
.spot-card {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 380px;
  max-width: calc(100% - 16px);
  height: calc(100% - 16px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  z-index: 1000;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1;
}
.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text);
  flex: 1;
  line-height: 1.3;
  padding-right: 8px;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  line-height: 0;
}
.close-btn:hover {
  color: var(--color-text);
  background: var(--color-bg);
}
.card-meta {
  padding: 12px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
}
.type-badge.public {
  background: #E0F2FE;
  color: #0369A1;
}
.type-badge.pourvoirie {
  background: var(--color-success-light);
  color: #065F46;
}
.meta-item {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.meta-item.distance {
  font-weight: 600;
  color: var(--color-primary);
}
.contact-info {
  padding: 12px 20px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.info-row {
  display: flex;
  gap: 6px;
  padding: 2px 0;
  font-size: 13px;
}
.info-label {
  color: var(--color-text-secondary);
  white-space: nowrap;
  min-width: 70px;
}
.info-value {
  color: var(--color-text);
}
.info-value.link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.info-value.link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
@media (max-width: 767px) {
  .spot-card {
    top: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
  .card-header {
    padding: 14px 16px 10px;
  }
  .card-title {
    font-size: 15px;
  }
  .card-meta {
    padding: 8px 16px;
  }
  .contact-info {
    padding: 8px 16px;
  }
  .species-section {
    padding: 12px 16px;
  }
}
.species-section {
  padding: 16px 20px;
}
.section-header {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}
</style>
