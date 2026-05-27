import { ref, onMounted } from 'vue'

export function useSpots() {
  const spots = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function loadSpots() {
    try {
      loading.value = true
      const response = await fetch('/fishing-quebec/data/spots.geojson')
      if (!response.ok) throw new Error('Failed to load spots data')
      const data = await response.json()
      spots.value = data.features || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(loadSpots)

  return { spots, loading, error, reload: loadSpots }
}
