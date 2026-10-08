export const $ = s => document.querySelector(s)

export const KEYS = ['seis', 'therm', 'gas', 'cam', 'wx']
export const RK = ['LOW', 'ELEVATED', 'HIGH', 'CRITICAL']
export const LV = ['NORMAL', 'ELEVATED', 'HIGH']
export const CC = ['#10b981', '#f59e0b', '#f43f5e']
export const RC = ['#10b981', '#f59e0b', '#ff5247', '#f43f5e']

export const O = {
  rm: matchMedia('(prefers-reduced-motion: reduce)').matches,
  smoke: 1,
  lab: 1,
  sp: 1
}

export const U = {
  name: 'Shilpa P',
  email: 'shilpa@volcanozero.ai'
}

export const UI = {
  f: 'All',
  sel: 'seis',
  rep: '',
  mapType: 'map' // 'map' or 'satellite'
}

export const META = {
  seis: [
    'Seismic Activity',
    'Seismic Sensor · North Station',
    'North Station',
    v => (v * 1).toFixed(1),
    [5, 7],
    'HIGH',
    '+42% increase'
  ],
  therm: [
    'Thermal Activity',
    'Thermal Sensor · Summit',
    'Summit Station',
    v => v.toFixed(0) + ' °C',
    [38, 45],
    'NORMAL',
    'No significant change'
  ],
  gas: [
    'Gas Emissions',
    'Gas Sensor · South Station',
    'South Station',
    v => v.toFixed(0) + ' ppm',
    [30, 50],
    'ELEVATED',
    'SO₂: 312 ppm'
  ],
  cam: [
    'Camera / Visual',
    'Spectral Camera · East Ridge',
    'East Ridge',
    v => 'Light plume',
    [4, 7],
    'SMOKE DETECTED',
    'Light plume visible'
  ],
  wx: [
    'Weather',
    'Meteorological Station · Base',
    'Base Station',
    v => v.toFixed(0) + ' km/h',
    [20, 35],
    'RAINY',
    'Visibility: Low'
  ]
}

export const BASE = { seis: 8.2, therm: 34, gas: 42, cam: 6.5, wx: 16 }
export const NZ = { seis: 0.25, therm: 0.6, gas: 1.5, cam: 0.2, wx: 1.0 }

// Exact hypotheses matching the UI reference image
export const HYN = [
  'Volcanic Instability',
  'Normal Activity',
  'Sensor Malfunction',
  'Weather Disturbance'
]
export const HYC = ['#f43f5e', '#10b981', '#38bdf8', '#a855f7']
export const HY = [
  [55, 20, 10, 15],
  [65, 15, 10, 10],
  [75, 10, 8, 7],
  [82, 8, 5, 5]
]

export const ACT0 = [
  'Continue monitoring all sensors',
  'Deploy drone to Gas Zone A',
  'Prepare alert for local authorities',
  'Monitor weather conditions',
  'Re-evaluate after new data arrives'
]
export const ACT5 = [
  'Alert authorities',
  'Prepare evacuation Zone A',
  'Restrict dangerous routes',
  'Continue drone monitoring',
  'Continue sensor collection'
]

export const AGN = [
  ['Orchestrator', 'Analyzing situation'],
  ['Seismic Agent', 'Monitoring seismic tremor (+42%)'],
  ['Thermal Agent', 'Crater thermal baseline normal'],
  ['Gas Agent', 'Elevated SO₂ detected (312 ppm)'],
  ['Evidence Agent', 'Cross-referencing plume & seismic signals'],
  ['Hypothesis Agent', 'Volcanic Instability 55%'],
  ['Information-Gain Agent', 'Selecting aerial gas measurement'],
  ['Mission Planner', 'Drone mission route ready'],
  ['Weather Agent', 'Rainy conditions, safe flight envelope']
]

export const MST = [
  'Mission Scheduled',
  'En Route to Zone A',
  'Collecting Gas Data',
  'Returning to Base'
]

// Pre-filled 6-hour realistic sparkline curves
export const createInitialHistory = () => {
  return {
    seis: [4.2, 4.4, 4.3, 4.5, 4.8, 5.2, 5.0, 5.3, 5.7, 6.1, 6.5, 6.4, 6.8, 7.2, 7.5, 7.4, 7.8, 7.9, 8.0, 8.1, 8.2, 8.2, 8.3, 8.2],
    therm: [33, 33, 34, 34, 33, 34, 35, 34, 34, 34, 35, 34, 34, 35, 34, 34, 34, 35, 34, 34, 34, 35, 34, 34],
    gas: [28, 29, 31, 30, 32, 33, 35, 36, 38, 39, 41, 40, 42, 43, 42, 44, 43, 42, 43, 42, 41, 42, 43, 42],
    cam: [2.0, 2.1, 2.0, 2.2, 2.5, 3.1, 3.8, 4.2, 4.8, 5.2, 5.5, 5.4, 5.8, 6.1, 6.2, 6.4, 6.5, 6.6, 6.5, 6.4, 6.5, 6.6, 6.5, 6.5],
    wx: [12, 13, 13, 14, 15, 16, 17, 18, 17, 16, 17, 18, 19, 18, 17, 16, 17, 16, 16, 17, 16, 17, 16, 16]
  }
}

export const fresh = () => ({
  cur: { ...BASE },
  tg: { ...BASE },
  h: createInitialHistory(),
  tl: [
    { t: '10:42', m: 'Seismic activity increased by 42% at North Station.', s: 2 },
    { t: '10:35', m: 'Camera optical feed detected light smoke plume.', s: 1 },
    { t: '10:20', m: 'SO₂ gas sensor elevated to 312 ppm.', s: 1 },
    { t: '09:50', m: 'Weather station reported light rain, visibility low.', s: 0 },
    { t: '08:15', m: 'Multi-sensor baseline synchronization online.', s: 0 }
  ],
  al: [
    { t: '10:42 AM', m: 'Seismic activity increased by 42%', s: 2 },
    { t: '10:35 AM', m: 'Smoke plume detected on crater webcam', s: 1 },
    { t: '10:20 AM', m: 'Gas emissions elevated (SO₂: 312 ppm)', s: 1 },
    { t: '09:50 AM', m: 'Rainy conditions detected, low visibility', s: 0 }
  ],
  ag: {
    Orchestrator: 'Autonomous investigation active',
    'Seismic Agent': 'Tremor +42% sustained',
    'Gas Agent': 'Elevated SO₂ 312 ppm',
    'Information-Gain Agent': 'Recommend gas mission'
  },
  inv: ['seis', 'gas'],
  risk: 1, // Elevated
  wx: 'Rainy',
  hy: HY[0],
  act: ACT0,
  ig: [['Gas', 0.81], ['Thermal', 0.42], ['Deformation', 0.35], ['Seismic', 0.22]],
  tz: 1,
  ban: 'INVESTIGATION IN PROGRESS',
  st: 'INVESTIGATION IN PROGRESS',
  sit: 'Seismic activity is HIGH (+42%) and gas emissions are ELEVATED, while thermal readings remain baseline.',
  why: 'Evidence suggests subsurface magma pressurization or hydrothermal venting. Drone gas sampling will maximize uncertainty reduction.',
  next: 'Collect additional gas data — Deploy drone to Gas Zone A.',
  run: 0,
  done: 0,
  mn: 'Gas Monitoring — Zone A',
  ms: 1,
  dst: 'In Flight'
})

export const lvl = k => {
  const v = S.cur[k], t = META[k][4]
  return v >= t[1] ? 2 : v >= t[0] ? 1 : 0
}

export const S = fresh()
export const V = { CLK: '11:24 AM', SEL: null, page: 'dash', mapMode: 'map' }
export const hooks = { refresh() {}, ui() {} }

export function resetS() {
  for (const k of Object.keys(S)) delete S[k]
  Object.assign(S, fresh())
}
