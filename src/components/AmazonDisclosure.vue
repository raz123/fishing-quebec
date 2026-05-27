<script setup>
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <div class="disclosure">
    {{ t('disclosure') }}
  </div>
</template>

<style scoped>
.disclosure {
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  padding: 8px 16px;
  border-top: 1px solid #e5e7eb;
}
</style>
