import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  ACTIONS, SEVERITIES, STORAGE_KEY, VILLAGES, ackProgress, alertsReducer, buildAlert,
  getSeverity, initialState, riskToSuggestedLevel, sanitizeLoadedState, villageAction,
} from './alertLogic.js'
import { createSirenEngine } from './sirenEngine.js'
import { readAppSnapshot } from './appAdapter.js'
import './community-alerts.css'

const e = React.createElement

const fmt = iso =>
  iso ? new Date(iso).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeLoadedState(JSON.parse(raw)) : initialState
  } catch {
    return initialState
  }
}

/* ── Siren hook: wraps the browser-only simulation engine ───────────── */
function useSiren(pattern) {
  const engineRef = useRef(null)
  if (!engineRef.current) engineRef.current = createSirenEngine()
  const [running, setRunning] = useState(false)
  const [muted, setMutedState] = useState(false)
  const [volume, setVolumeState] = useState(30)

  useEffect(() => {
    const engine = engineRef.current
    return () => engine.stop() // never leave audio playing after leaving the page
  }, [])

  useEffect(() => {
    engineRef.current.setPattern(pattern)
  }, [pattern])

  const start = useCallback(() => {
    const engine = engineRef.current
    engine.setMuted(muted)
    engine.setVolume(volume / 100)
    if (engine.start(pattern)) setRunning(true)
  }, [pattern, muted, volume])

  const stop = useCallback(() => {
    engineRef.current.stop()
    setRunning(false)
  }, [])

  const toggleMute = useCallback(() => {
    setMutedState(m => {
      engineRef.current.setMuted(!m)
      return !m
    })
  }, [])

  const setVolume = useCallback(v => {
    setVolumeState(v)
    engineRef.current.setVolume(v / 100)
  }, [])

  return { supported: engineRef.current.supported, running, muted, volume, start, stop, toggleMute, setVolume }
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function CommunityAlertsPage() {
  const [state, dispatch] = useReducer(alertsReducer, undefined, loadInitialState)
  const [selectedLevel, setSelectedLevel] = useState(3)
  const [snapshot, setSnapshot] = useState(() => readAppSnapshot())
  const reduced = useMemo(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const active = state.alerts.find(a => a.id === state.activeId) || null
  const displayLevel = active ? active.level : selectedLevel
  const sev = getSeverity(displayLevel)
  const siren = useSiren(sev.siren)
  const suggested = riskToSuggestedLevel(snapshot.appRisk)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* storage unavailable */ }
  }, [state])

  useEffect(() => {
    const t = setInterval(() => setSnapshot(readAppSnapshot()), 2000) // read-only polling
    return () => clearInterval(t)
  }, [])

  const issue = () => {
    dispatch({
      type: 'ISSUE',
      alert: buildAlert({ level: selectedLevel, volcano: { name: snapshot.volcanoName, authority: snapshot.authority } }),
    })
  }
  const allClear = () => {
    siren.stop()
    dispatch({ type: 'RESOLVE', at: new Date().toISOString() })
  }
  const now = () => new Date().toISOString()

  return e('div', { className: 'ca-root' },
    e('header', { className: 'ca-head' },
      e('div', null,
        e('h1', null, 'Community Alerts'),
        e('p', { className: 'ca-sub' }, 'Community Siren & Emergency Alert System — ', snapshot.volcanoName)
      ),
      e('div', { className: 'ca-sim-tag', role: 'note' },
        '⚠ SIMULATED DEMO — no real alerts, sirens or messages are sent; no real villagers are contacted.')
    ),

    renderBanner({ active, sev, reduced, onAck: () => dispatch({ type: 'ACK_ALERT', id: active && active.id, at: now() }) }),

    e('div', { className: 'ca-grid' },
      /* Controls */
      e('section', { className: 'ca-card', 'aria-labelledby': 'ca-ctl' },
        e('h2', { id: 'ca-ctl' }, 'Simulated alert controls'),
        e('div', { className: 'ca-sevs', role: 'radiogroup', 'aria-label': 'Alert severity' },
          SEVERITIES.map(s =>
            e('button', {
              key: s.level, type: 'button', role: 'radio', 'aria-checked': selectedLevel === s.level,
              className: 'ca-sev' + (selectedLevel === s.level ? ' on' : ''),
              style: { '--c': s.color }, onClick: () => setSelectedLevel(s.level),
            }, e('b', null, s.level), e('span', null, s.label))
          )
        ),
        e('div', { className: 'ca-row' },
          e('button', { type: 'button', className: 'ca-btn ca-primary', onClick: issue }, 'Issue simulated alert'),
          e('button', { type: 'button', className: 'ca-btn', onClick: allClear, disabled: !active }, 'Issue all-clear'),
          e('button', {
            type: 'button', className: 'ca-btn', disabled: suggested === null,
            onClick: () => suggested && setSelectedLevel(suggested),
            title: 'Pre-selects a severity from the main app risk level (read-only)',
          }, 'Use app risk level')
        ),
        e('p', { className: 'ca-note' },
          'App risk (read-only): ', e('b', null, snapshot.appRiskLabel),
          suggested ? ` → suggests ${getSeverity(suggested).label}` : ' → no alert suggested')
      ),

      /* Siren */
      e('section', { className: 'ca-card', 'aria-labelledby': 'ca-sir' },
        e('h2', { id: 'ca-sir' }, 'Siren simulation'),
        e('div', { className: 'ca-siren-status', 'aria-live': 'polite' },
          e('span', { className: 'ca-led' + (siren.running ? (siren.muted ? ' muted' : ' on') : '') }),
          siren.running ? (siren.muted ? 'Running — MUTED' : 'Sounding (this device only)') : 'Stopped'
        ),
        e('div', { className: 'ca-row' },
          e('button', { type: 'button', className: 'ca-btn ca-danger', onClick: siren.start, disabled: siren.running || !siren.supported }, '▶ Start Siren'),
          e('button', { type: 'button', className: 'ca-btn', onClick: siren.stop, disabled: !siren.running }, '■ Stop Siren'),
          e('button', { type: 'button', className: 'ca-btn' + (siren.muted ? ' on' : ''), onClick: siren.toggleMute, 'aria-pressed': siren.muted },
            siren.muted ? '🔇 Unmute' : '🔈 Mute')
        ),
        e('label', { className: 'ca-vol' }, 'Volume ',
          e('input', { type: 'range', min: 0, max: 100, value: siren.volume, onChange: ev => siren.setVolume(Number(ev.target.value)), 'aria-label': 'Siren volume' }),
          e('span', null, siren.volume + '%')),
        e('p', { className: 'ca-note' },
          siren.supported
            ? 'Browser-generated tone for demonstration only. Start with a low volume.'
            : 'Web Audio is not supported in this browser, so the siren cannot play.')
      )
    ),

    e('div', { className: 'ca-grid' },
      /* Evacuation instructions */
      e('section', { className: 'ca-card', 'aria-labelledby': 'ca-ins' },
        e('h2', { id: 'ca-ins' }, 'Evacuation instructions ',
          e('small', null, active ? '(active alert)' : '(preview of selected severity)')),
        e('p', { className: 'ca-lvl-name', style: { color: sev.color } }, `${sev.label} — ${sev.headline}`),
        e('ol', { className: 'ca-list' }, sev.instructions.map((t, i) => e('li', { key: i }, t))),
        e('p', { className: 'ca-note' }, 'Demo guidance only. In a real event, follow your official authority.')
      ),
      /* Snapshot */
      e('section', { className: 'ca-card', 'aria-labelledby': 'ca-snap' },
        e('h2', { id: 'ca-snap' }, 'App data (read-only)'),
        e('dl', { className: 'ca-dl' },
          e('dt', null, 'Volcano'), e('dd', null, snapshot.volcanoName + (snapshot.country ? ` · ${snapshot.country}` : '')),
          e('dt', null, 'Alert authority'), e('dd', null, snapshot.authority),
          e('dt', null, 'App risk level'), e('dd', null, snapshot.appRiskLabel),
          e('dt', null, 'Data source'), e('dd', null, 'Simulated alert data (this page)')
        ),
        e('p', { className: 'ca-note' },
          'Opened standalone, this page shows the app defaults. It reads state only and never changes risk or predictions.')
      )
    ),

    /* Villages */
    e('section', { className: 'ca-card', 'aria-labelledby': 'ca-vil' },
      e('div', { className: 'ca-card-head' },
        e('h2', { id: 'ca-vil' }, 'Village information ', e('small', null, '(simulated demo villages)')),
        active && e('button', {
          type: 'button', className: 'ca-btn', onClick: () => dispatch({ type: 'ACK_ALL_VILLAGES', id: active.id, at: now() }),
          disabled: ackProgress(active).done === ackProgress(active).total,
        }, 'Simulate all acknowledgements')
      ),
      active && e('p', { className: 'ca-note' }, `Simulated village acknowledgements: ${ackProgress(active).done} / ${ackProgress(active).total}`),
      e('div', { className: 'ca-scroll' },
        e('table', { className: 'ca-table' },
          e('thead', null, e('tr', null,
            ['Village', 'Zone', 'Population (demo)', 'Distance', 'Status', 'Assembly point', 'Acknowledgement'].map(h => e('th', { key: h, scope: 'col' }, h)))),
          e('tbody', null, VILLAGES.map(v => {
            const act = villageAction(displayLevel, v)
            const ackAt = active && active.villageAcks[v.id]
            return e('tr', { key: v.id },
              e('td', null, v.name),
              e('td', null, v.zone),
              e('td', null, v.population.toLocaleString()),
              e('td', null, v.distanceKm + ' km'),
              e('td', null, e('span', { className: 'ca-chip ca-act-' + act }, ACTIONS[act])),
              e('td', null, v.assembly),
              e('td', null,
                act === 'none' || !active
                  ? '—'
                  : ackAt
                    ? `✓ ${fmt(ackAt)} (simulated)`
                    : e('button', { type: 'button', className: 'ca-btn ca-small', onClick: () => dispatch({ type: 'ACK_VILLAGE', id: active.id, villageId: v.id, at: now() }) }, 'Simulate acknowledge'))
            )
          }))
        )
      )
    ),

    /* History */
    e('section', { className: 'ca-card', 'aria-labelledby': 'ca-his' },
      e('div', { className: 'ca-card-head' },
        e('h2', { id: 'ca-his' }, 'Alert history ', e('small', null, '(simulated)')),
        e('button', { type: 'button', className: 'ca-btn ca-small', onClick: () => dispatch({ type: 'CLEAR_HISTORY' }), disabled: state.alerts.length <= (active ? 1 : 0) }, 'Clear past alerts')
      ),
      state.alerts.length === 0
        ? e('p', { className: 'ca-empty' }, 'No simulated alerts yet. Choose a severity and press “Issue simulated alert”.')
        : e('ul', { className: 'ca-history' }, state.alerts.map(a => {
          const p = ackProgress(a)
          const s = getSeverity(a.level)
          return e('li', { key: a.id, style: { '--c': s.color } },
            e('span', { className: 'ca-chip', style: { background: s.color } }, a.label),
            e('div', { className: 'ca-h-main' },
              e('b', null, a.headline),
              e('small', null, `${a.id} · issued ${fmt(a.issuedAt)} · ${a.volcanoName} · SIMULATED`)),
            e('div', { className: 'ca-h-meta' },
              e('span', null, a.status === 'active' ? 'ACTIVE' : a.status === 'resolved' ? `Resolved ${fmt(a.resolvedAt)}` : `Superseded ${fmt(a.resolvedAt)}`),
              e('span', null, a.operatorAck ? `Operator ack ${fmt(a.operatorAck.at)}` : 'Not acknowledged'),
              e('span', null, `Villages ${p.done}/${p.total}`))
          )
        }))
    ),

    e('p', { className: 'ca-foot' }, 'All alerts, villages, populations and acknowledgements on this page are simulated demonstration data.')
  )
}

function renderBanner({ active, sev, reduced, onAck }) {
  if (!active) {
    return e('section', { className: 'ca-banner ca-idle', 'aria-live': 'polite' },
      e('b', null, 'NO ACTIVE SIMULATED ALERT'),
      e('span', null, 'Select a severity below and issue a simulated alert to see the danger banner.'))
  }
  const flash = !active.operatorAck && !reduced
  return e('section', {
    className: `ca-banner ca-lvl-${active.level}${flash ? ' ca-flash' : ''}`,
    style: { '--c': sev.color }, role: 'alert',
  },
    e('div', { className: 'ca-banner-top' },
      e('span', { className: 'ca-banner-tag' }, 'SIMULATED ALERT · DEMO DATA'),
      e('span', { className: 'ca-banner-level' }, `LEVEL ${active.level} · ${active.label}`)),
    e('h2', null, '⚠ ' + active.headline),
    e('p', null, active.message),
    e('div', { className: 'ca-banner-meta' },
      e('span', null, `${active.volcanoName} · ${active.authority} (simulated)`),
      e('span', null, `Issued ${fmt(active.issuedAt)}`),
      active.operatorAck
        ? e('span', null, `✓ Acknowledged ${fmt(active.operatorAck.at)}`)
        : e('button', { type: 'button', className: 'ca-btn ca-primary', onClick: onAck }, 'Acknowledge alert')
    )
  )
}
