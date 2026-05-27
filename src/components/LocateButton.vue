<script setup>
import { useI18n } from '../i18n/index.js'

defineProps({
  locating: { type: Boolean, default: false }
})

defineEmits(['locate'])

const { t } = useI18n()
</script>

<template>
  <button
    class="locate-btn"
    :disabled="locating"
    @click="$emit('locate')"
  >
    <svg v-if="!locating" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/>
    </svg>
    <span v-if="locating" class="spinner"></span>
    <span>{{ locating ? t('locate.locating') : t('locate.button') }}</span>
  </button>
</template>

<style scoped>
.locate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
  font-family: inherit;
}
.locate-btn:hover:not(:disabled) {
  background: #fff;
  box-shadow: var(--shadow-lg);
  border-color: var(--color-secondary);
  color: var(--color-primary);
}
.locate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.locate-btn svg {
  color: var(--color-primary);
}
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
