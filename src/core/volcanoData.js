// Real Volcano Registry with verified geographic coordinates, elevations, and monitoring networks
export const VOLCANOES = [
  {
    id: 'merapi',
    name: 'Mount Merapi',
    country: 'Indonesia',
    coords: [-7.5407, 110.4457],
    elevation: 2910,
    status: 'Investigation in Progress',
    defaultRisk: 1,
    type: 'Stratovolcano',
    lastMajorEruption: '2023',
    alertAuthority: 'CVGHM (BPPTKG)',
    stations: [
      { id: 'north', name: 'Plawangan Station', type: 'seis', label: 'Seismic', offset: [0.03, -0.01] },
      { id: 'summit', name: 'Pasarbubar Summit', type: 'therm', label: 'Thermal', offset: [0.005, 0.002] },
      { id: 'south', name: 'Kaliurang Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.04, 0.015] },
      { id: 'west', name: 'Babadan Station', type: 'def', label: 'Deformation', offset: [-0.01, -0.035] },
      { id: 'east', name: 'Deles Station', type: 'wx', label: 'Weather', offset: [0.015, 0.03] }
    ],
    droneBaseOffset: [-0.045, -0.02],
    targetZoneOffset: [0.012, 0.008]
  },
  {
    id: 'fuji',
    name: 'Mount Fuji',
    country: 'Japan',
    coords: [35.3606, 138.7274],
    elevation: 3776,
    status: 'Routine Monitoring',
    defaultRisk: 0,
    type: 'Stratovolcano',
    lastMajorEruption: '1707 (Hoei)',
    alertAuthority: 'JMA (Japan Meteorological Agency)',
    stations: [
      { id: 'north', name: 'Kawaguchiko Observatory', type: 'seis', label: 'Seismic', offset: [0.04, 0.01] },
      { id: 'summit', name: 'Fuji Crater Rim', type: 'therm', label: 'Thermal', offset: [0.002, -0.001] },
      { id: 'south', name: 'Fujinomiya Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.045, -0.02] },
      { id: 'west', name: 'Motosu Sensor Station', type: 'def', label: 'Deformation', offset: [0.01, -0.05] },
      { id: 'east', name: 'Gotemba Station', type: 'wx', label: 'Weather', offset: [-0.02, 0.04] }
    ],
    droneBaseOffset: [-0.05, -0.03],
    targetZoneOffset: [0.015, 0.01]
  },
  {
    id: 'etna',
    name: 'Mount Etna',
    country: 'Italy',
    coords: [37.7510, 14.9934],
    elevation: 3357,
    status: 'Active Degassing',
    defaultRisk: 1,
    type: 'Stratovolcano',
    lastMajorEruption: '2024',
    alertAuthority: 'INGV Catania',
    stations: [
      { id: 'north', name: 'Pizzi Deneri High Station', type: 'seis', label: 'Seismic', offset: [0.025, 0.01] },
      { id: 'summit', name: 'Southeast Crater', type: 'therm', label: 'Thermal', offset: [0.003, 0.001] },
      { id: 'south', name: 'Rifugio Sapienza', type: 'gas', label: 'Gas (SO₂)', offset: [-0.035, -0.01] },
      { id: 'west', name: 'Bronte Tiltmeter', type: 'def', label: 'Deformation', offset: [0.01, -0.04] },
      { id: 'east', name: 'Valle del Bove Met', type: 'wx', label: 'Weather', offset: [-0.015, 0.035] }
    ],
    droneBaseOffset: [-0.04, -0.02],
    targetZoneOffset: [0.01, 0.015]
  },
  {
    id: 'kilauea',
    name: 'Kīlauea',
    country: 'United States',
    coords: [19.4194, -155.2885],
    elevation: 1247,
    status: 'Halemaʻumaʻu Active',
    defaultRisk: 2,
    type: 'Shield Volcano',
    lastMajorEruption: '2024',
    alertAuthority: 'USGS Hawaiian Volcano Observatory (HVO)',
    stations: [
      { id: 'north', name: 'Uēkahuna Vault', type: 'seis', label: 'Seismic', offset: [0.02, 0.015] },
      { id: 'summit', name: 'Halemaʻumaʻu Overlook', type: 'therm', label: 'Thermal', offset: [0.001, 0.002] },
      { id: 'south', name: 'South Caldera Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.025, -0.01] },
      { id: 'west', name: 'Kīlauea Iki Tiltmeter', type: 'def', label: 'Deformation', offset: [0.005, -0.03] },
      { id: 'east', name: 'East Rift Zone Met', type: 'wx', label: 'Weather', offset: [-0.015, 0.04] }
    ],
    droneBaseOffset: [-0.035, -0.025],
    targetZoneOffset: [0.008, 0.005]
  },
  {
    id: 'vesuvius',
    name: 'Mount Vesuvius',
    country: 'Italy',
    coords: [40.8224, 14.4289],
    elevation: 1281,
    status: 'Quiescent Monitoring',
    defaultRisk: 0,
    type: 'Somma-Stratovolcano',
    lastMajorEruption: '1944',
    alertAuthority: 'INGV Osservatorio Vesuviano',
    stations: [
      { id: 'north', name: 'Monte Somma Station', type: 'seis', label: 'Seismic', offset: [0.02, -0.005] },
      { id: 'summit', name: 'Gran Cono Rim', type: 'therm', label: 'Thermal', offset: [0.002, 0.001] },
      { id: 'south', name: 'Ercolano Gas Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.03, -0.02] },
      { id: 'west', name: 'Osservatorio Storico', type: 'def', label: 'Deformation', offset: [0.005, -0.03] },
      { id: 'east', name: 'Ottaviano Station', type: 'wx', label: 'Weather', offset: [0.015, 0.03] }
    ],
    droneBaseOffset: [-0.035, -0.02],
    targetZoneOffset: [0.01, 0.008]
  },
  {
    id: 'helens',
    name: 'Mount St. Helens',
    country: 'United States',
    coords: [46.1914, -122.1956],
    elevation: 2549,
    status: 'Dome Growth Monitor',
    defaultRisk: 0,
    type: 'Stratovolcano',
    lastMajorEruption: '2008',
    alertAuthority: 'USGS Cascades Volcano Observatory (CVO)',
    stations: [
      { id: 'north', name: 'Johnston Ridge Obs', type: 'seis', label: 'Seismic', offset: [0.04, -0.015] },
      { id: 'summit', name: 'Lava Dome Thermal', type: 'therm', label: 'Thermal', offset: [0.001, 0.002] },
      { id: 'south', name: 'Worm Flows Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.03, 0.01] },
      { id: 'west', name: 'Castle Lake Tiltmeter', type: 'def', label: 'Deformation', offset: [0.01, -0.04] },
      { id: 'east', name: 'Windy Ridge Met', type: 'wx', label: 'Weather', offset: [0.02, 0.03] }
    ],
    droneBaseOffset: [0.045, -0.02],
    targetZoneOffset: [0.005, 0.005]
  },
  {
    id: 'mayon',
    name: 'Mount Mayon',
    country: 'Philippines',
    coords: [13.2566, 123.6854],
    elevation: 2463,
    status: 'Alert Level 2 (Elevated)',
    defaultRisk: 1,
    type: 'Stratovolcano',
    lastMajorEruption: '2023',
    alertAuthority: 'PHIVOLCS (DOST)',
    stations: [
      { id: 'north', name: 'Tabaco City Station', type: 'seis', label: 'Seismic', offset: [0.04, 0.02] },
      { id: 'summit', name: 'Crater Vent Station', type: 'therm', label: 'Thermal', offset: [0.001, 0.001] },
      { id: 'south', name: 'Legazpi Observatory', type: 'gas', label: 'Gas (SO₂)', offset: [-0.05, -0.01] },
      { id: 'west', name: 'Ligao Tiltmeter', type: 'def', label: 'Deformation', offset: [-0.01, -0.045] },
      { id: 'east', name: 'Malilipot Met Station', type: 'wx', label: 'Weather', offset: [0.02, 0.035] }
    ],
    droneBaseOffset: [-0.055, -0.02],
    targetZoneOffset: [0.01, 0.008]
  },
  {
    id: 'eyjafjallajokull',
    name: 'Eyjafjallajökull',
    country: 'Iceland',
    coords: [63.6330, -19.6220],
    elevation: 1651,
    status: 'Subglacial Rest',
    defaultRisk: 0,
    type: 'Stratovolcano (Subglacial)',
    lastMajorEruption: '2010',
    alertAuthority: 'Icelandic Meteorological Office (IMO)',
    stations: [
      { id: 'north', name: 'Thórsmörk Station', type: 'seis', label: 'Seismic', offset: [0.03, 0.02] },
      { id: 'summit', name: 'Caldera Ice Thermal', type: 'therm', label: 'Thermal', offset: [0.002, 0.001] },
      { id: 'south', name: 'Skógar Gas Monitoring', type: 'gas', label: 'Gas (SO₂)', offset: [-0.04, -0.015] },
      { id: 'west', name: 'Seljalandsfoss Tilt', type: 'def', label: 'Deformation', offset: [-0.01, -0.04] },
      { id: 'east', name: 'Mýrdalsjökull Met', type: 'wx', label: 'Weather', offset: [0.01, 0.04] }
    ],
    droneBaseOffset: [-0.045, -0.02],
    targetZoneOffset: [0.008, 0.005]
  },
  {
    id: 'popocatepetl',
    name: 'Popocatépetl',
    country: 'Mexico',
    coords: [19.0224, -98.6279],
    elevation: 5426,
    status: 'Yellow Phase 2 (Active Exhalations)',
    defaultRisk: 1,
    type: 'Stratovolcano',
    lastMajorEruption: '2023-2024',
    alertAuthority: 'CENAPRED',
    stations: [
      { id: 'north', name: 'Paso de Cortés Station', type: 'seis', label: 'Seismic', offset: [0.04, 0.01] },
      { id: 'summit', name: 'Crater Thermal Array', type: 'therm', label: 'Thermal', offset: [0.002, 0.001] },
      { id: 'south', name: 'Amecameca Gas Sensor', type: 'gas', label: 'Gas (SO₂)', offset: [-0.04, -0.02] },
      { id: 'west', name: 'Tlamacas Tiltmeter', type: 'def', label: 'Deformation', offset: [0.02, -0.03] },
      { id: 'east', name: 'Puebla Radar & Met', type: 'wx', label: 'Weather', offset: [-0.01, 0.045] }
    ],
    droneBaseOffset: [0.045, 0.015],
    targetZoneOffset: [0.008, 0.005]
  },
  {
    id: 'ruapehu',
    name: 'Mount Ruapehu',
    country: 'New Zealand',
    coords: [-39.2817, 175.5685],
    elevation: 2797,
    status: 'Crater Lake Heating Cycle',
    defaultRisk: 1,
    type: 'Stratovolcano',
    lastMajorEruption: '2007',
    alertAuthority: 'GeoNet (GNS Science)',
    stations: [
      { id: 'north', name: 'Iwikau Village Station', type: 'seis', label: 'Seismic', offset: [0.035, -0.01] },
      { id: 'summit', name: 'Te Wai ā-moe Crater Lake', type: 'therm', label: 'Thermal', offset: [0.001, 0.001] },
      { id: 'south', name: 'Tukino Gas Array', type: 'gas', label: 'Gas (SO₂)', offset: [-0.03, 0.02] },
      { id: 'west', name: 'Whakapapa Tiltmeter', type: 'def', label: 'Deformation', offset: [0.02, -0.035] },
      { id: 'east', name: 'Desert Road Met', type: 'wx', label: 'Weather', offset: [-0.01, 0.04] }
    ],
    droneBaseOffset: [0.04, -0.015],
    targetZoneOffset: [0.008, 0.005]
  },
  {
    id: 'barren',
    name: 'Barren Island Volcano',
    country: 'India',
    coords: [12.2780, 93.8580],
    elevation: 354,
    status: 'Sporadic Ash Eruptions',
    defaultRisk: 1,
    type: 'Stratovolcano (Island)',
    lastMajorEruption: '2022',
    alertAuthority: 'Geological Survey of India (GSI) / INCOIS',
    stations: [
      { id: 'north', name: 'Caldera North Sensor', type: 'seis', label: 'Seismic', offset: [0.008, -0.002] },
      { id: 'summit', name: 'Central Cone Thermal', type: 'therm', label: 'Thermal', offset: [0.001, 0.001] },
      { id: 'south', name: 'South Shore Gas Buoy', type: 'gas', label: 'Gas (SO₂)', offset: [-0.009, 0.003] },
      { id: 'west', name: 'West Ridge Tiltmeter', type: 'def', label: 'Deformation', offset: [0.002, -0.008] },
      { id: 'east', name: 'Andaman Sea Marine Met', type: 'wx', label: 'Weather', offset: [0.004, 0.009] }
    ],
    droneBaseOffset: [-0.012, -0.005],
    targetZoneOffset: [0.004, 0.003]
  },
  {
    id: 'villarrica',
    name: 'Villarrica',
    country: 'Chile',
    coords: [-39.4203, -71.9397],
    elevation: 2847,
    status: 'Lava Lake Active',
    defaultRisk: 2,
    type: 'Stratovolcano',
    lastMajorEruption: '2023',
    alertAuthority: 'SERNAGEOMIN (OVDAS)',
    stations: [
      { id: 'north', name: 'Pucón Observatory', type: 'seis', label: 'Seismic', offset: [0.045, -0.02] },
      { id: 'summit', name: 'Active Crater Vent', type: 'therm', label: 'Thermal', offset: [0.001, 0.001] },
      { id: 'south', name: 'Coñaripe Station', type: 'gas', label: 'Gas (SO₂)', offset: [-0.04, 0.015] },
      { id: 'west', name: 'Villarrica National Park Tilt', type: 'def', label: 'Deformation', offset: [0.01, -0.04] },
      { id: 'east', name: 'Curarrehue Met', type: 'wx', label: 'Weather', offset: [-0.015, 0.035] }
    ],
    droneBaseOffset: [0.045, -0.025],
    targetZoneOffset: [0.008, 0.006]
  }
]

export const COUNTRIES = [
  'All Countries',
  'Indonesia',
  'Japan',
  'Italy',
  'United States',
  'Philippines',
  'Iceland',
  'Mexico',
  'New Zealand',
  'India',
  'Chile'
]

// Current active volcano reference
export let activeVolcano = VOLCANOES[0] // Merapi by default

export function setActiveVolcano(id) {
  const v = VOLCANOES.find(x => x.id === id || x.name.toLowerCase().includes(id.toLowerCase()))
  if (v) {
    activeVolcano = v
    return v
  }
  return activeVolcano
}
