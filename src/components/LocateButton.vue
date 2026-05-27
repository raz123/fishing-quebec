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
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.15s;
}
.locate-btn:hover:not(:disabled) {
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.locate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #d1d5db;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
