<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { useBitingNow } from '../composables/useBitingNow.js'

const props = defineProps({
  species: { type: Object, default: null },
  data: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const { t, locale } = useI18n()
const { isBitingNow } = useBitingNow()

const tipsText = computed(() => {
  if (!props.data) return ''
  const tips = locale.value === 'fr' ? props.data.fr.tips : props.data.en.tips
  const method = locale.value === 'fr' ? props.data.method.fr : props.data.method.en
  return tips && !method.startsWith(tips.slice(0, 30)) ? tips : ''
})

function getAmazonUrl(equipName) {
  const asin = props.data?.asin?.[equipName]
  if (!asin || !asin.trim()) return null
  return `https://www.amazon.ca/dp/${asin}?tag=redag2-20`
}
</script>

<template>
  <div v-if="species && data" class="popup-overlay" @click.self="$emit('close')">
    <div class="popup-card">
      <div class="popup-header">
        <h3 class="popup-title">{{ locale === 'fr' ? species.fr : species.en }}</h3>
        <span class="popup-latin">{{ species.latin }}</span>
        <span v-if="isBitingNow(species.fr)" class="popup-biting">{{ locale === 'fr' ? 'En action' : 'Biting now' }}</span>
        <button class="popup-close" @click="$emit('close')" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="popup-body">
        <div class="info-grid">
          <div class="info-item">
            <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h4v4H6z"/><path d="M14 4h4v4h-4z"/><path d="M6 14h4v4H6z"/><path d="M14 14h4v4h-4z"/></svg>
            <div>
              <div class="info-label">{{ t('speciesPopup.season') }}</div>
              <div class="info-value">{{ locale === 'fr' ? data.season.fr : data.season.en }}</div>
            </div>
          </div>

          <div class="info-item">
            <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
            <div>
              <div class="info-label">{{ t('speciesPopup.bestTime') }}</div>
              <div class="info-value">{{ locale === 'fr' ? data.timeOfDay.fr : data.timeOfDay.en }}</div>
            </div>
          </div>

          <div class="info-item" style="grid-column: 1 / -1;">
            <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 2 4.1 2 8.6c0 3.3 2.7 5.3 5.3 6.5.5.2.7-.2.7-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.3.8 1.3.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.7-.9-3.7-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3.7 0 1.4.1 2 .3 1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.5.7.5 1.4v2.1c0 .2.2.5.7.4 2.6-1.2 5.3-3.2 5.3-6.5C22 4.1 16.4 2 12 2z"/></svg>
              Amazon
            </a>
            <span v-else class="amazon-btn disabled">Amazon</span>
          </div>
        </div>

        <div v-if="tipsText" class="tips-box">
          <svg class="tips-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
          <span>{{ tipsText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 74, 110, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.popup-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.98);
  z-index: 1;
}
.popup-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.popup-latin {
  font-style: italic;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.popup-biting {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 10px;
  background: #BBF7D0;
  color: #065F46;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  animation: pulse-badge 2s infinite;
}
@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.popup-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  line-height: 0;
}
.popup-close:hover {
  color: var(--color-text);
  background: var(--color-bg);
}
.popup-body {
  padding: 20px 24px 24px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}
.info-item:hover {
  background: #E0F2FE;
}
.info-icon {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 1px;
}
.info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-value {
  font-size: 13px;
  color: var(--color-text);
  margin-top: 2px;
  line-height: 1.4;
}
.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 10px;
}
.equipment-grid {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}
.equip-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: all var(--transition-fast);
}
.equip-card:hover {
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}
.equip-name {
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
}
.amazon-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  background: var(--color-cta);
  color: #fff;
  text-decoration: none;
  transition: all var(--transition-fast);
}
.amazon-btn:hover {
  background: var(--color-cta-hover);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
}
.amazon-btn.disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}
.tips-box {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #065F46;
  line-height: 1.5;
}
.tips-icon {
  flex-shrink: 0;
  color: var(--color-success);
  margin-top: 2px;
}
</style>
