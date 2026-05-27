import { computed, ref } from 'vue'

function haversineDistance(p1, p2) {
  const R = 6371
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useFilters(spots, userPosition) {
  const selectedSpecies = ref([])
  const spotType = ref('all')
  const showOutOfSeason = ref(false)

  const allSpecies = computed(() => {
    const speciesSet = new Set()
    for (const spot of spots.value) {
      for (const s of spot.properties.species || []) {
        speciesSet.add(s.fr)
      }
    }
    return Array.from(speciesSet).sort()
  })

  const filteredSpots = computed(() => {
    let result = [...spots.value]

    if (spotType.value !== 'all') {
      result = result.filter(s => s.properties.type === spotType.value)
    }

    if (selectedSpecies.value.length > 0) {
      result = result.filter(spot => {
        const spotSpecies = (spot.properties.species || []).map(s => s.fr)
        return selectedSpecies.value.some(sp => spotSpecies.includes(sp))
      })
    }

    if (userPosition.value) {
      result.forEach(spot => {
        const coords = spot.geometry.coordinates
        spot._distance = haversineDistance(
          { lat: userPosition.value.lat, lng: userPosition.value.lng },
          { lat: coords[1], lng: coords[0] }
        )
      })
      result.sort((a, b) => a._distance - b._distance)
    }

    return result
  })

  function toggleSpecies(speciesFr) {
    const idx = selectedSpecies.value.indexOf(speciesFr)
    if (idx >= 0) {
      selectedSpecies.value.splice(idx, 1)
    } else {
      selectedSpecies.value.push(speciesFr)
    }
  }

  function setSpotType(type) {
    spotType.value = type
  }

  function clearFilters() {
    selectedSpecies.value = []
    spotType.value = 'all'
  }

  return {
    selectedSpecies,
    spotType,
    showOutOfSeason,
    allSpecies,
    filteredSpots,
    toggleSpecies,
    setSpotType,
    clearFilters
  }
}
