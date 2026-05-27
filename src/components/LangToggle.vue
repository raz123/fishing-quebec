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
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-md);
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  letter-spacing: 0.02em;
}
.lang-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
