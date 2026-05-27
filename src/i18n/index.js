import { ref, computed } from 'vue'

const locale = ref('en')

const messages = {
  en: {
    app: {
      title: 'Quebec Fishing Spots',
      subtitle: 'Find public fishing spots and pourvoiries (outfitters) across Quebec'
    },
    filter: {
      species: 'Fish Species',
      spotType: 'Spot Type',
      all: 'All',
      public: 'Public',
      pourvoirie: 'Pourvoirie',
      noSpecies: 'No species data available',
      noSpots: 'No spots match the current filters.',
      outOfSeason: 'Show out-of-season species'
    },
    spot: {
      species: 'Species',
      equipment: 'Recommended Equipment',
      tips: 'Fishing Tips',
      buyOnAmazon: 'Buy on Amazon',
      phone: 'Phone',
      website: 'Website',
      email: 'Email',
      address: 'Address',
      season: 'Season',
      type: 'Type',
      region: 'Region',
      selectPrompt: 'Click a spot on the map to see details',
      loading: 'Loading spots...'
    },
    locate: {
      button: 'Near Me',
      locating: 'Locating...',
      denied: 'Location access denied. Enable it in your browser settings.',
      error: 'Unable to determine your location.'
    },
    lang: {
      switch: 'FR'
    },
    speciesPopup: {
      season: 'Season',
      bestTime: 'Best time',
      method: 'Method'
    },
    disclosure: 'As an Amazon Associate I earn from qualifying purchases.',
    footer: 'Data source: Données Québec (CC-BY 4.0)'
  },
  fr: {
    app: {
      title: 'Zones de pêche au Québec',
      subtitle: 'Trouvez des sites de pêche publics et des pourvoiries partout au Québec'
    },
    filter: {
      species: 'Espèces de poisson',
      spotType: 'Type de site',
      all: 'Tous',
      public: 'Public',
      pourvoirie: 'Pourvoirie',
      noSpecies: 'Aucune donnée d\'espèces disponible',
      noSpots: 'Aucun site ne correspond aux filtres actuels.',
      outOfSeason: 'Afficher les espèces hors-saison'
    },
    spot: {
      species: 'Espèces',
      equipment: 'Équipement recommandé',
      tips: 'Conseils de pêche',
      buyOnAmazon: 'Acheter sur Amazon',
      phone: 'Téléphone',
      website: 'Site web',
      email: 'Courriel',
      address: 'Adresse',
      season: 'Saison',
      type: 'Type',
      region: 'Région',
      selectPrompt: 'Cliquez sur un site sur la carte pour voir les détails',
      loading: 'Chargement des sites...'
    },
    locate: {
      button: 'Autour de moi',
      locating: 'Localisation...',
      denied: 'Accès à la position refusé. Activez-le dans les paramètres de votre navigateur.',
      error: 'Impossible de déterminer votre position.'
    },
    lang: {
      switch: 'EN'
    },
    speciesPopup: {
      season: 'Saison',
      bestTime: 'Meilleur moment',
      method: 'Méthode'
    },
    disclosure: 'En tant qu\'Associé Amazon, je réalise un bénéfice sur les achats remplissant les conditions.',
    footer: 'Source des données : Données Québec (CC-BY 4.0)'
  }
}

export function useI18n() {
  function t(key) {
    const keys = key.split('.')
    let val = messages[locale.value]
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k]
      else return key
    }
    return val
  }

  function toggleLang() {
    locale.value = locale.value === 'en' ? 'fr' : 'en'
  }

  return {
    locale,
    t,
    toggleLang
  }
}

export { locale }
