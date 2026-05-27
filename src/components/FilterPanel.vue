<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '../i18n/index.js'

const props = defineProps({
  species: { type: Array, default: () => [] },
  selectedSpecies: { type: Array, default: () => [] },
  spotType: { type: String, default: 'all' },
  showOutOfSeason: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-species', 'set-spot-type', 'toggle-season'])

const { t } = useI18n()
const searchQuery = ref('')
const showAllSpecies = ref(false)

const filteredSpecies = ref([...props.species])

watch(() => props.species, (val) => {
  filteredSpecies.value = [...val]
})

function onSearch() {
  const q = searchQuery.value.toLowerCase()
  if (!q) {
    filteredSpecies.value = [...props.species]
  } else {
    filteredSpecies.value = props.species.filter(s =>
      s.toLowerCase().includes(q)
    )
  }
}
</script>

<template>
  <div class="filter-panel">
    <h3 class="filter-title">{{ t('filter.species') }}</h3>
    <input
      v-model="searchQuery"
      type="text"
      class="filter-search"
      :placeholder="t('filter.species') + '...'"
      @input="onSearch"
    />
    <div class="species-list">
      <label
        v-for="species in filteredSpecies.slice(0, showAllSpecies ? filteredSpecies.length : 20)"
        :key="species"
        class="species-item"
      >
        <input
          type="checkbox"
          :checked="selectedSpecies.includes(species)"
          @change="$emit('toggle-species', species)"
        />
        <span>{{ species }}</span>
      </label>
      <button
        v-if="filteredSpecies.length > 20"
        class="show-more-btn"
        @click="showAllSpecies = !showAllSpecies"
      >
        {{ showAllSpecies ? '▲' : '▼' }}
        {{ showAllSpecies ? '' : `+${filteredSpecies.length - 20} more` }}
      </button>
    </div>

    <h3 class="filter-title">{{ t('filter.spotType') }}</h3>
    <div class="type-toggle">
      <button
        :class="{ active: spotType === 'all' }"
        @click="$emit('set-spot-type', 'all')"
      >{{ t('filter.all') }}</button>
      <button
        :class="{ active: spotType === 'public' }"
        @click="$emit('set-spot-type', 'public')"
      >{{ t('filter.public') }}</button>
      <button
        :class="{ active: spotType === 'pourvoirie' }"
        @click="$emit('set-spot-type', 'pourvoirie')"
      >{{ t('filter.pourvoirie') }}</button>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  padding: 16px;
}
.filter-title {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.filter-search {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  margin-bottom: 10px;
  box-sizing: border-box;
  font-family: inherit;
  color: var(--color-text);
  transition: all var(--transition-fast);
}
.filter-search::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.6;
}
.filter-search:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}
.species-list {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 16px;
}
.species-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  font-size: 13px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}
.species-item:hover {
  background: var(--color-bg);
}
.species-item input {
  accent-color: var(--color-primary);
}
.show-more-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 0;
  transition: color var(--transition-fast);
}
.show-more-btn:hover {
  color: var(--color-primary-hover);
}
.type-toggle {
  display: flex;
  gap: 4px;
}
.type-toggle button {
  flex: 1;
  padding: 7px 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}
.type-toggle button.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.type-toggle button:hover:not(.active) {
  background: var(--color-bg);
  border-color: var(--color-secondary);
}
</style>
