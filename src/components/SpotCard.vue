<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import SpeciesList from './SpeciesList.vue'
import equipmentData from '../../data-src/equipment.json'

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
</script>

<template>
  <div v-if="spot" class="spot-card">
    <div class="card-header">
      <h2 class="card-title">{{ spotName }}</h2>
      <button class="close-btn" @click="$emit('close')">&times;</button>
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
      <div v-if="spot.properties.season" class="info-row">
        <span class="info-label">{{ t('spot.season') }}:</span>
        <span class="info-value">{{ spot.properties.season }}</span>
      </div>
    </div>

    <div class="species-section">
      <h3 class="section-header">{{ t('spot.species') }} ({{ (spot.properties.species || []).length }})</h3>
      <SpeciesList
        :species-list="spot.properties.species || []"
        :equipment-data="equipmentData"
      />
    </div>
  </div>
</template>

<style scoped>
.spot-card {
  position: absolute;
  top: 0;
  right: 0;
  width: 380px;
  max-width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 16px 8px;
  border-bottom: 1px solid #e5e7eb;
}
.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  line-height: 1.3;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0 0 0 8px;
  line-height: 1;
}
.close-btn:hover {
  color: #111827;
}
.card-meta {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
.type-badge.public {
  background: #dbeafe;
  color: #1d4ed8;
}
.type-badge.pourvoirie {
  background: #dcfce7;
  color: #15803d;
}
.meta-item {
  font-size: 12px;
  color: #6b7280;
}
.meta-item.distance {
  font-weight: 600;
  color: #6366f1;
}
.contact-info {
  padding: 8px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.info-row {
  display: flex;
  gap: 6px;
  padding: 2px 0;
  font-size: 13px;
}
.info-label {
  color: #6b7280;
  white-space: nowrap;
  min-width: 70px;
}
.info-value {
  color: #374151;
}
.info-value.link {
  color: #3b82f6;
  text-decoration: none;
}
.info-value.link:hover {
  text-decoration: underline;
}
.species-section {
  padding: 12px 16px;
}
.section-header {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
</style>
