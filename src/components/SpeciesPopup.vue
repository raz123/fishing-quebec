<script setup>
import { useI18n } from '../i18n/index.js'

const props = defineProps({
  species: { type: Object, default: null },
  data: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const { t, locale } = useI18n()

function getAmazonUrl(equipName) {
  const asin = props.data?.asin?.[equipName]
  if (!asin || !asin.trim()) return null
  return `https://www.amazon.com/dp/${asin}?tag=redag2-20`
}
</script>

<template>
  <div v-if="species && data" class="popup-overlay" @click.self="$emit('close')">
    <div class="popup-card">
      <div class="popup-header">
        <h3 class="popup-title">{{ locale === 'fr' ? species.fr : species.en }}</h3>
        <span class="popup-latin">{{ species.latin }}</span>
        <button class="popup-close" @click="$emit('close')">&times;</button>
      </div>

      <div class="popup-body">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-icon">&#127788;</span>
            <div>
              <div class="info-label">{{ t('speciesPopup.season') }}</div>
              <div class="info-value">{{ locale === 'fr' ? data.season.fr : data.season.en }}</div>
            </div>
          </div>

          <div class="info-item">
            <span class="info-icon">&#127749;</span>
            <div>
              <div class="info-label">{{ t('speciesPopup.bestTime') }}</div>
              <div class="info-value">{{ locale === 'fr' ? data.timeOfDay.fr : data.timeOfDay.en }}</div>
            </div>
          </div>

          <div class="info-item" style="grid-column: 1 / -1;">
            <span class="info-icon">&#127907;</span>
            <div>
              <div class="info-label">{{ t('speciesPopup.method') }}</div>
              <div class="info-value">{{ locale === 'fr' ? data.method.fr : data.method.en }}</div>
            </div>
          </div>
        </div>

        <h4 class="section-title">{{ t('spot.equipment') }}</h4>
        <div class="equipment-grid">
          <div
            v-for="item in (locale === 'fr' ? data.fr.equipment : data.en.equipment)"
            :key="item"
            class="equip-card"
          >
            <div class="equip-name">{{ item }}</div>
            <a
              v-if="getAmazonUrl(item)"
              :href="getAmazonUrl(item)"
              target="_blank"
              rel="noopener sponsored"
              class="amazon-btn"
            >
              Amazon
            </a>
            <span v-else class="amazon-btn disabled">Amazon</span>
          </div>
        </div>

        <div v-if="(locale === 'fr' ? data.fr.tips : data.en.tips)" class="tips-box">
          <span class="tips-icon">&#128161;</span>
          <span>{{ locale === 'fr' ? data.fr.tips : data.en.tips }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.popup-card {
  background: #fff;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}
.popup-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.popup-latin {
  font-style: italic;
  font-size: 12px;
  color: #9ca3af;
}
.popup-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}
.popup-close:hover {
  color: #111827;
}
.popup-body {
  padding: 16px 20px 20px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}
.info-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
}
.info-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-value {
  font-size: 13px;
  color: #374151;
  margin-top: 2px;
}
.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
}
.equipment-grid {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
}
.equip-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
}
.equip-name {
  font-size: 13px;
  color: #374151;
}
.amazon-btn {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #f59e0b;
  color: #f59e0b;
  text-decoration: none;
  transition: all 0.15s;
}
.amazon-btn:hover {
  background: #f59e0b;
  color: #fff;
}
.amazon-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
.tips-box {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.4;
}
.tips-icon {
  font-size: 16px;
  flex-shrink: 0;
}
</style>
