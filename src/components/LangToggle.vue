<script setup>
import { useI18n } from '../i18n/index.js'

const { t, toggleLang } = useI18n()
</script>

<template>
  <button class="lang-toggle" @click="toggleLang" :title="t('lang.switch')">
    {{ t('lang.switch') }}
  </button>
</template>

<style scoped>
.lang-toggle {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}
.lang-toggle:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}
</style>
