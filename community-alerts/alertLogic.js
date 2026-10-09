/**
 * Community Siren & Emergency Alert System — pure logic (no DOM, no React).
 *
 * EVERYTHING in this folder is a SIMULATION. No physical sirens are triggered,
 * no SMS / radio / push messages are sent, and no real villagers are contacted.
 */

export const STORAGE_KEY = 'vz.communityAlerts.simulated.v1'
export const MAX_HISTORY = 50

export const SEVERITIES = [
  {
    level: 1,
    key: 'advisory',
    label: 'ADVISORY',
    color: '#38bdf8',
    headline: 'Volcanic unrest detected — stay informed',
    message:
      'Monitoring indicates elevated activity. No evacuation is required. Residents should follow official updates and review their family plan.',
    instructions: [
      'Stay tuned to official channels for updates.',
      'Review your family evacuation plan and meeting point.',
      'Check that your emergency kit (water, food, torch, radio, medicines) is ready.',
      'No travel restrictions are in effect at this level.',
    ],
    siren: { type: 'wail', low: 420, high: 600, period: 6 },
  },
  {
    level: 2,
    key: 'watch',
    label: 'WATCH',
    color: '#fbbf24',
    headline: 'Activity increasing — prepare to evacuate',
    message:
      'Sensor activity is rising. Residents in the inner zone should prepare to leave on short notice.',
    instructions: [
      'Zone A households: pack essentials and documents now.',
      'Arrange transport and care for children, elderly and anyone with mobility needs.',
      'Keep vehicles fuelled and facing the exit route.',
      'Avoid the summit area and river valleys.',
      'Keep your phone or radio on for the next update.',
    ],
    siren: { type: 'wail', low: 450, high: 700, period: 5 },
  },
  {
    level: 3,
    key: 'warning',
    label: 'WARNING',
    color: '#ff7a45',
    headline: 'Eruption possible — evacuate Zone A now',
    message:
      'Conditions indicate a likely eruption. Zone A must evacuate immediately. Zone B should be ready to move.',
    instructions: [
      'Zone A: leave now using the marked evacuation route to your assembly point.',
      'Zone B: be packed and ready; leave when instructed.',
      'Wear a mask and eye protection against ash; cover water and food.',
      'Stay out of river valleys and drainage channels (lahar risk).',
      'Check in at the assembly point so your household is counted.',
    ],
    siren: { type: 'wail', low: 500, high: 850, period: 3.5 },
  },
  {
    level: 4,
    key: 'emergency',
    label: 'EMERGENCY',
    color: '#f43f5e',
    headline: 'Eruption imminent or under way — evacuate Zones A and B',
    message:
      'An eruption is imminent or in progress. Zones A and B must evacuate immediately. Zone C should prepare to leave.',
    instructions: [
      'Zones A and B: evacuate immediately. Do not return for belongings.',
      'Zone C: prepare to leave and follow instructions from officials.',
      'Move away from the volcano and out of river valleys; never shelter in them.',
      'If caught in ashfall: cover nose and mouth, protect eyes, stay indoors if you cannot leave safely.',
      'Report to your assembly point and confirm your household is accounted for.',
    ],
    siren: { type: 'hilo', low: 650, high: 850, period: 1.2 },
  },
]

export function getSeverity(level) {
  return SEVERITIES.find(s => s.level === level) || SEVERITIES[0]
}

/** Simulated demo villages — NOT real places or real population figures. */
export const VILLAGES = [
  { id: 'v1', name: 'Demo Village Alpha', zone: 'A', population: 820, distanceKm: 3.2, assembly: 'Assembly Point 1 (demo school ground)' },
  { id: 'v2', name: 'Demo Village Bravo', zone: 'A', population: 460, distanceKm: 4.1, assembly: 'Assembly Point 1 (demo school ground)' },
  { id: 'v3', name: 'Demo Village Charlie', zone: 'B', population: 1340, distanceKm: 6.8, assembly: 'Assembly Point 2 (demo community hall)' },
  { id: 'v4', name: 'Demo Village Delta', zone: 'B', population: 910, distanceKm: 8.5, assembly: 'Assembly Point 2 (demo community hall)' },
  { id: 'v5', name: 'Demo Village Echo', zone: 'C', population: 2100, distanceKm: 11.9, assembly: 'Assembly Point 3 (demo sports field)' },
  { id: 'v6', name: 'Demo Village Foxtrot', zone: 'C', population: 1580, distanceKm: 13.4, assembly: 'Assembly Point 3 (demo sports field)' },
]

export const ACTIONS = { none: 'No action', prepare: 'Prepare', evacuate: 'EVACUATE NOW' }

/** What a zone is told to do at a given severity level. */
export function zoneAction(level, zone) {
  const table = {
    A: { 1: 'none', 2: 'prepare', 3: 'evacuate', 4: 'evacuate' },
    B: { 1: 'none', 2: 'none', 3: 'prepare', 4: 'evacuate' },
    C: { 1: 'none', 2: 'none', 3: 'none', 4: 'prepare' },
  }
  return (table[zone] && table[zone][level]) || 'none'
}

export function villageAction(level, village) {
  return zoneAction(level, village.zone)
}

export function requiredVillageIds(level) {
  return VILLAGES.filter(v => villageAction(level, v) !== 'none').map(v => v.id)
}

/** Map the main app's risk index (0–3: LOW…CRITICAL) to a suggested simulated level, or null. */
export function riskToSuggestedLevel(risk) {
  if (risk === 1) return 2
  if (risk === 2) return 3
  if (risk === 3) return 4
  return null
}

let counter = 0
export function makeAlertId(now = new Date()) {
  counter += 1
  return `SIM-${now.getTime().toString(36).toUpperCase()}-${counter}`
}

export function buildAlert({ level, volcano, now = new Date(), id }) {
  const sev = getSeverity(level)
  return {
    id: id || makeAlertId(now),
    simulated: true,
    level: sev.level,
    label: sev.label,
    headline: sev.headline,
    message: sev.message,
    volcanoName: (volcano && volcano.name) || 'Demo Volcano',
    authority: (volcano && volcano.authority) || 'Demo Authority',
    issuedAt: now.toISOString(),
    status: 'active', // active | resolved | superseded
    resolvedAt: null,
    operatorAck: null, // { at, by }
    villageAcks: {}, // villageId -> ISO time (simulated acknowledgement)
    requiredVillageIds: requiredVillageIds(sev.level),
  }
}

export function ackProgress(alert) {
  const total = alert.requiredVillageIds.length
  const done = alert.requiredVillageIds.filter(id => alert.villageAcks[id]).length
  return { done, total, pct: total === 0 ? 100 : Math.round((done / total) * 100) }
}

export const initialState = { alerts: [], activeId: null }

function mapAlert(state, id, fn) {
  return { ...state, alerts: state.alerts.map(a => (a.id === id ? fn(a) : a)) }
}

export function alertsReducer(state, action) {
  switch (action.type) {
    case 'ISSUE': {
      const at = action.alert.issuedAt
      const prior = state.alerts.map(a =>
        a.id === state.activeId && a.status === 'active'
          ? { ...a, status: 'superseded', resolvedAt: at }
          : a
      )
      return { alerts: [action.alert, ...prior].slice(0, MAX_HISTORY), activeId: action.alert.id }
    }
    case 'RESOLVE': {
      if (!state.activeId) return state
      return { ...mapAlert(state, state.activeId, a => ({ ...a, status: 'resolved', resolvedAt: action.at })), activeId: null }
    }
    case 'ACK_ALERT':
      return mapAlert(state, action.id, a => (a.operatorAck ? a : { ...a, operatorAck: { at: action.at, by: action.by || 'Operator (simulated)' } }))
    case 'ACK_VILLAGE':
      return mapAlert(state, action.id, a =>
        !a.requiredVillageIds.includes(action.villageId) || a.villageAcks[action.villageId]
          ? a
          : { ...a, villageAcks: { ...a.villageAcks, [action.villageId]: action.at } }
      )
    case 'ACK_ALL_VILLAGES':
      return mapAlert(state, action.id, a => {
        const acks = { ...a.villageAcks }
        for (const vid of a.requiredVillageIds) if (!acks[vid]) acks[vid] = action.at
        return { ...a, villageAcks: acks }
      })
    case 'CLEAR_HISTORY':
      return { alerts: state.alerts.filter(a => a.id === state.activeId), activeId: state.activeId }
    default:
      return state
  }
}

/** Validate whatever came out of localStorage; fall back to an empty state on anything odd. */
export function sanitizeLoadedState(raw) {
  try {
    if (!raw || !Array.isArray(raw.alerts)) return initialState
    const alerts = raw.alerts
      .filter(
        a =>
          a && typeof a.id === 'string' && a.simulated === true &&
          [1, 2, 3, 4].includes(a.level) && typeof a.issuedAt === 'string' &&
          Array.isArray(a.requiredVillageIds) && a.villageAcks && typeof a.villageAcks === 'object'
      )
      .slice(0, MAX_HISTORY)
    const activeId = alerts.some(a => a.id === raw.activeId && a.status === 'active') ? raw.activeId : null
    return { alerts, activeId }
  } catch {
    return initialState
  }
}
