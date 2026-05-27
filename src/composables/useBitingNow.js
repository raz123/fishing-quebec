import { computed } from 'vue'
import equipmentData from '../../data-src/equipment.json'

const FR_MONTHS = {
  'Janvier': 1, 'Février': 2, 'Mars': 3, 'Avril': 4, 'Mai': 5, 'Juin': 6,
  'Juillet': 7, 'Août': 8, 'Septembre': 9, 'Octobre': 10, 'Novembre': 11, 'Décembre': 12
}

const TIME_MAP = {
  'Aube': { slots: ['dawn'], weight: 1 },
  'Aube et crépuscule': { slots: ['dawn', 'dusk'], weight: 1 },
  'Tôt le matin': { slots: ['early_morning'], weight: 1 },
  'Avant-midi et fin d\'après-midi': { slots: ['late_morning', 'late_afternoon'], weight: 0.8 },
  'Mi-journée': { slots: ['midday'], weight: 0.7 },
  'Après-midi': { slots: ['afternoon'], weight: 0.8 },
  'Après-midi et début de soirée': { slots: ['afternoon', 'evening'], weight: 0.9 },
  'Soirée et aube': { slots: ['evening', 'dawn'], weight: 1 },
  'Crépuscule et nuit': { slots: ['dusk', 'night'], weight: 0.9 },
  'Toute la journée': { slots: ['all'], weight: 0.6 },
  'Jour': { slots: ['daytime'], weight: 0.6 },
  'Jour et nuit': { slots: ['all'], weight: 0.6 },
  'Nuit': { slots: ['night'], weight: 0.9 },
  'Fin d\'après-midi': { slots: ['late_afternoon'], weight: 0.9 }
}

function getCurrentTimeSlots() {
  const h = new Date().getHours()
  const slots = []
  if (h >= 4 && h < 6) slots.push('dawn')
  if (h >= 5 && h < 9) slots.push('early_morning')
  if (h >= 9 && h < 11) slots.push('late_morning')
  if (h >= 11 && h < 13) slots.push('midday')
  if (h >= 13 && h < 15) slots.push('afternoon')
  if (h >= 15 && h < 18) slots.push('late_afternoon')
  if (h >= 18 && h < 21) slots.push('evening')
  if (h >= 20 || h < 5) slots.push('dusk', 'night')
  if (h >= 6 && h < 18) slots.push('daytime')
  slots.push('all')
  return slots
}

function parseSeasonRange(seasonFr) {
  const parts = seasonFr.split(' à ').map(s => s.trim())
  if (parts.length !== 2) return null
  const start = FR_MONTHS[parts[0]]
  const end = FR_MONTHS[parts[1]]
  if (!start || !end) return null
  return { start, end, wraps: end < start }
}

export function useBitingNow() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentSlots = getCurrentTimeSlots()

  function isInSeason(frenchName) {
    const data = equipmentData[frenchName]
    if (!data) return false
    const range = parseSeasonRange(data.season.fr)
    if (!range) return true
    if (range.wraps) return currentMonth >= range.start || currentMonth <= range.end
    return currentMonth >= range.start && currentMonth <= range.end
  }

  function getTimeScore(frenchName) {
    const data = equipmentData[frenchName]
    if (!data) return 0
    const mapping = TIME_MAP[data.timeOfDay.fr]
    if (!mapping) return 0
    if (mapping.slots.some(s => currentSlots.includes(s))) return mapping.weight
    return 0
  }

  function getBiteScore(frenchName) {
    if (!isInSeason(frenchName)) return 0
    return getTimeScore(frenchName)
  }

  function isBitingNow(frenchName) {
    return getBiteScore(frenchName) > 0
  }

  const activeSpeciesCount = computed(() => {
    let count = 0
    for (const key of Object.keys(equipmentData)) {
      if (isBitingNow(key)) count++
    }
    return count
  })

  return { isInSeason, isBitingNow, getBiteScore, activeSpeciesCount }
}
