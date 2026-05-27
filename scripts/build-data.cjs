const fs = require('fs');
const path = require('path');

const STATIONS_URL = 'https://geo.environnement.gouv.qc.ca/donnees/rest/services/Eau/Guide_poisson/MapServer/0/query';
const FISH_URL = 'https://geo.environnement.gouv.qc.ca/donnees/rest/services/Eau/Guide_poisson/MapServer/1/query';
const POURVOIRIES_URL = 'https://api-v3.tourinsoft.com/api/syndications/mto.tourinsoft.com/78f151be-cb64-4875-abbf-f2e0e4be2d7b?format=json';

function translateSpecies(frName) {
  const map = {
    'Omble de fontaine': 'Brook trout',
    'Touladi': 'Lake trout',
    'Truite arc-en-ciel': 'Rainbow trout',
    'Truite brune': 'Brown trout',
    'Doré jaune': 'Walleye',
    'Doré noir': 'Sauger',
    'Grand brochet': 'Northern pike',
    'Maskinongé': 'Muskellunge',
    'Achigan à petite bouche': 'Smallmouth bass',
    'Achigan à grande bouche': 'Largemouth bass',
    'Achigan': 'Bass',
    'Perchaude': 'Yellow perch',
    'Barbotte brune': 'Brown bullhead',
    'Barbue de rivière': 'Channel catfish',
    'Esturgeon jaune': 'Lake sturgeon',
    'Grand corégone': 'Lake whitefish',
    'Ouananiche': 'Landlocked Atlantic salmon',
    'Saumon atlantique': 'Atlantic salmon',
    'Omble chevalier': 'Arctic char',
    'Éperlan arc-en-ciel': 'Rainbow smelt',
    'Poulamon atlantique': 'Atlantic tomcod',
    'Lotte': 'Burbot',
    'Malachigan': 'Freshwater drum',
    'Crapet soleil': 'Pumpkinseed',
    'Marigane noire': 'Black crappie',
    'Meunier rouge': 'Longnose sucker',
    'Meunier noir': 'White sucker',
    'Cisco de lac': 'Lake cisco',
    'Crapet de roche': 'Rock bass',
    'Crapet-soleil': 'Pumpkinseed',
    'Bar rayé': 'Striped bass',
    'Anguille d\'Amérique': 'American eel',
  };
  return map[frName] || frName;
}

async function fetchAllRecords(url, layer) {
  const records = [];
  let offset = 0;
  const limit = 2000;
  let exceeded = true;

  while (exceeded) {
    const fullUrl = `${url}?where=1%3D1&outFields=*&returnGeometry=${layer === 0 ? 'true' : 'false'}&f=geojson&resultRecordCount=${limit}&resultOffset=${offset}`;
    const response = await fetch(fullUrl);
    const data = await response.json();

    if (data.features) {
      records.push(...data.features);
    }

    exceeded = data.exceededTransferLimit === true;
    offset += limit;

    if (!exceeded) break;
    console.log(`  Fetched ${records.length} records so far...`);
  }

  return records;
}

async function fetchPourvoiries() {
  const response = await fetch(POURVOIRIES_URL);
  const data = await response.json();
  return data.value || [];
}

function normalizeCoordinates(lon, lat) {
  if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
    return { lon: lon, lat: lat };
  }
  return { lon: parseFloat(lon), lat: parseFloat(lat) };
}

function getSpotName(frName, description) {
  let name = frName || 'Plan d\'eau sans toponyme';
  name = name.replace(/,/g, ', ').trim();
  return name;
}

function spotTypeFromMilieu(milieu) {
  switch (milieu) {
    case 'Lac': return 'Lake';
    case 'Rivière': return 'River';
    case 'Cours d\'eau': return 'Stream';
    case 'Barrage': return 'Dam';
    default: return milieu;
  }
}

async function main() {
  console.log('Fetching fishing stations...');
  const stations = await fetchAllRecords(STATIONS_URL, 0);
  console.log(`  Got ${stations.length} stations`);

  console.log('Fetching fish species data...');
  const fishRecords = await fetchAllRecords(FISH_URL, 1);
  console.log(`  Got ${fishRecords.length} fish records`);

  const fishByStation = {};
  for (const fish of fishRecords) {
    const attrs = fish.properties;
    const bqma = attrs.NO_BQMA;
    if (!fishByStation[bqma]) fishByStation[bqma] = [];
    const fr = attrs.NOM_COMMUN;
    fishByStation[bqma].push({
      fr: fr,
      en: attrs.NOM_ANGLAIS || translateSpecies(fr),
      latin: attrs.NOM_LATIN || '',
      status: attrs.STATUT_PECHE || ''
    });
  }

  console.log('Fetching pourvoiries...');
  const pourvoiries = await fetchPourvoiries();
  console.log(`  Got ${pourvoiries.length} pourvoiries`);

  const features = [];

  for (const station of stations) {
    const attrs = station.properties;
    const bqma = attrs.NO_BQMA;
    const species = fishByStation[bqma] || [];

    let lon = attrs.LONGITUDE;
    let lat = attrs.LATITUDE;

    if (!lon || !lat) {
      if (station.geometry && station.geometry.coordinates) {
        lon = station.geometry.coordinates[0];
        lat = station.geometry.coordinates[1];
      }
    }

    if (lon == null || lat == null) continue;

    const coords = normalizeCoordinates(lon, lat);
    if (isNaN(coords.lon) || isNaN(coords.lat)) continue;

    const nameFr = attrs.HYDRONYME || `Station ${bqma}`;

    features.push({
      type: 'Feature',
      properties: {
        id: `station-${bqma}`,
        name_fr: getSpotName(nameFr, attrs.DESCRIPTION),
        name_en: getSpotName(nameFr, attrs.DESCRIPTION),
        type: 'public',
        milieu: spotTypeFromMilieu(attrs.MILIEU_HYDRO),
        description_fr: attrs.DESCRIPTION || '',
        description_en: attrs.DESCRIPTION || '',
        species: species,
        region: attrs.ZGIEBV || '',
        url_regles: attrs.URL_REGLES || '',
        equipment: [],
        amazon_links: {}
      },
      geometry: {
        type: 'Point',
        coordinates: [coords.lon, coords.lat]
      }
    });
  }

  for (const p of pourvoiries) {
    const geo = p.Geolocalisations && p.Geolocalisations[0];
    if (!geo) continue;

    const lat = parseFloat(geo.Latitude);
    const lon = parseFloat(geo.Longitude);
    if (isNaN(lat) || isNaN(lon)) continue;

    const addr = p.Adresses && p.Adresses[0] || {};
    const phone = p.TelephonePrincipals && p.TelephonePrincipals[0]?.Coordonnees || '';
    const email = p.Courriels && p.Courriels[0]?.Coordonnees || '';
    const website = p.SiteInternets && p.SiteInternets[0]?.Coordonnees || '';

    const rawSpecies = p.EspecesPecheess && p.EspecesPecheess[0]?.Especespechees || [];
    const species = rawSpecies.map(s => {
      const fr = s.ThesLibelle || '';
      return {
        fr: fr,
        en: translateSpecies(fr) || fr,
        latin: '',
        status: 'Autorisée'
      };
    });

    const period = p.PeriodeOuvertures && p.PeriodeOuvertures[0];
    const seasonStr = period
      ? `${period.Datedebut || '?'} - ${period.Datefin || '?'}`
      : '';

    const street = addr.Numerovoie || '';
    const city = addr.Municipalite || '';
    const postal = addr.CodePostal || '';
    const address = [street, city, postal].filter(Boolean).join(', ');

    features.push({
      type: 'Feature',
      properties: {
        id: `pourvoirie-${p.SyndicObjectID || Math.random().toString(36).slice(2)}`,
        name_fr: p.SyndicObjectName || p.Identifications?.[0]?.Nomdefiche || '',
        name_en: p.SyndicObjectName || p.Identifications?.[0]?.Nomdefiche || '',
        type: 'pourvoirie',
        milieu: 'Pourvoirie',
        description_fr: '',
        description_en: '',
        species: species,
        region: '',
        phone: phone,
        email: email,
        website: website,
        address: address,
        season: seasonStr,
        equipment: [],
        amazon_links: {}
      },
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    });
  }

  const collection = {
    type: 'FeatureCollection',
    features: features
  };

  const json = JSON.stringify(collection);

  const outDirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', 'public', 'data')
  ];

  for (const dir of outDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'spots.geojson'), json);
  }

  console.log(`\nWritten ${features.length} spots`);
  console.log(`  Public: ${features.filter(f => f.properties.type === 'public').length}`);
  console.log(`  Pourvoiries: ${features.filter(f => f.properties.type === 'pourvoirie').length}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
