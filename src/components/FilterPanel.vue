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
  padding: 12px;
}
.filter-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.filter-search {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 8px;
  box-sizing: border-box;
}
.filter-search:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.species-list {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 12px;
}
.species-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 13px;
  cursor: pointer;
}
.species-item input {
  accent-color: #3b82f6;
}
.show-more-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 0;
}
.show-more-btn:hover {
  text-decoration: underline;
}
.type-toggle {
  display: flex;
  gap: 4px;
}
.type-toggle button {
  flex: 1;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.type-toggle button.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
.type-toggle button:hover:not(.active) {
  background: #f3f4f6;
}
</style>
