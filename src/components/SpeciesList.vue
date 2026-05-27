<script setup>
import { useI18n } from '../i18n/index.js'

const props = defineProps({
  speciesList: { type: Array, default: () => [] },
  equipmentData: { type: Object, default: () => ({}) }
})

const { t, locale } = useI18n()

function getEquipment(speciesFr) {
  const eq = props.equipmentData[speciesFr]
  if (!eq) return null
  return locale.value === 'fr' ? eq.fr : eq.en
}

function getTips(speciesFr) {
  const eq = props.equipmentData[speciesFr]
  if (!eq) return null
  return locale.value === 'fr' ? eq.tips : eq.en.tips
}

function getAmazonUrl(equipmentName) {
  const forSpecies = Object.values(props.equipmentData).find(eq => {
    const items = [...(eq.en?.equipment || []), ...(eq.fr?.equipment || [])]
    return items.includes(equipmentName)
  })
  if (!forSpecies) return null
  const asin = forSpecies.asin?.[equipmentName]
  if (!asin || !asin.trim()) return null
  return `https://www.amazon.com/dp/${asin}?tag=redag2-20`
}
</script>

<template>
  <div class="species-list">
    <div
      v-for="species in speciesList"
      :key="species.fr"
      class="species-card"
    >
      <div class="species-header">
        <span class="species-name">{{ locale === 'fr' ? species.fr : species.en }}</span>
        <span class="species-latin">{{ species.latin }}</span>
      </div>

      <div v-if="getEquipment(species.fr)" class="equipment-section">
        <h4 class="section-title">{{ t('spot.equipment') }}</h4>
        <ul class="equipment-items">
          <li
            v-for="item in getEquipment(species.fr).equipment"
            :key="item"
            class="equipment-item"
          >
            <span>{{ item }}</span>
            <a
              v-if="getAmazonUrl(item)"
              :href="getAmazonUrl(item)"
              target="_blank"
              rel="noopener sponsored"
              class="amazon-link"
              :title="t('spot.buyOnAmazon')"
            >
              Amazon
            </a>
          </li>
        </ul>
        <p v-if="getEquipment(species.fr).tips" class="tips-text">
          {{ getEquipment(species.fr).tips }}
        </p>
      </div>

      <div v-else class="no-data">
        {{ t('filter.noSpecies') }}
      </div>
    </div>

    <div v-if="speciesList.length === 0" class="empty-state">
      {{ t('spot.selectPrompt') }}
    </div>
  </div>
</template>

<style scoped>
.species-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.species-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #f9fafb;
}
.species-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
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
}
.section-title {
  margin: 8px 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.equipment-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.equipment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  font-size: 13px;
  color: #374151;
}
.amazon-link {
  font-size: 11px;
  color: #f59e0b;
  text-decoration: none;
  font-weight: 600;
  padding: 1px 6px;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  transition: all 0.15s;
}
.amazon-link:hover {
  background: #f59e0b;
  color: #fff;
}
.tips-text {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}
.no-data {
  font-size: 12px;
  color: #9ca3af;
}
.empty-state {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  padding: 24px;
}
</style>
