// Run with:  node --test community-alerts/tests/
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_HISTORY, SEVERITIES, VILLAGES, ackProgress, alertsReducer, buildAlert, initialState,
  requiredVillageIds, riskToSuggestedLevel, sanitizeLoadedState, villageAction, zoneAction,
} from '../alertLogic.js'

const vol = { name: 'Test Volcano', authority: 'Test Authority' }
const mk = (level, id) => buildAlert({ level, volcano: vol, id, now: new Date('2026-01-01T00:00:00Z') })

test('four severity levels with siren patterns and instructions', () => {
  assert.deepEqual(SEVERITIES.map(s => s.level), [1, 2, 3, 4])
  for (const s of SEVERITIES) {
    assert.ok(s.instructions.length >= 4)
    assert.ok(s.siren.high > s.siren.low && s.siren.period > 0)
  }
})

test('zone actions escalate with severity', () => {
  assert.equal(zoneAction(1, 'A'), 'none')
  assert.equal(zoneAction(2, 'A'), 'prepare')
  assert.equal(zoneAction(3, 'A'), 'evacuate')
  assert.equal(zoneAction(3, 'B'), 'prepare')
  assert.equal(zoneAction(4, 'B'), 'evacuate')
  assert.equal(zoneAction(4, 'C'), 'prepare')
  assert.equal(zoneAction(2, 'C'), 'none')
  assert.equal(zoneAction(3, 'Z'), 'none')
})

test('required villages grow with severity', () => {
  assert.equal(requiredVillageIds(1).length, 0)
  assert.equal(requiredVillageIds(2).length, 2)
  assert.equal(requiredVillageIds(3).length, 4)
  assert.equal(requiredVillageIds(4).length, VILLAGES.length)
  assert.equal(villageAction(4, VILLAGES[0]), 'evacuate')
})

test('buildAlert is always flagged simulated', () => {
  const a = mk(3, 'A1')
  assert.equal(a.simulated, true)
  assert.equal(a.status, 'active')
  assert.equal(a.level, 3)
})

test('risk index maps to suggested level (LOW suggests none)', () => {
  assert.equal(riskToSuggestedLevel(0), null)
  assert.equal(riskToSuggestedLevel(1), 2)
  assert.equal(riskToSuggestedLevel(2), 3)
  assert.equal(riskToSuggestedLevel(3), 4)
})

test('issue → acknowledge → resolve flow', () => {
  let s = alertsReducer(initialState, { type: 'ISSUE', alert: mk(3, 'A1') })
  assert.equal(s.activeId, 'A1')
  s = alertsReducer(s, { type: 'ACK_ALERT', id: 'A1', at: 't1' })
  assert.equal(s.alerts[0].operatorAck.at, 't1')
  s = alertsReducer(s, { type: 'ACK_ALERT', id: 'A1', at: 't2' }) // idempotent
  assert.equal(s.alerts[0].operatorAck.at, 't1')
  s = alertsReducer(s, { type: 'RESOLVE', at: 't3' })
  assert.equal(s.activeId, null)
  assert.equal(s.alerts[0].status, 'resolved')
})

test('new alert supersedes the active one; history is newest-first and capped', () => {
  let s = alertsReducer(initialState, { type: 'ISSUE', alert: mk(2, 'A1') })
  s = alertsReducer(s, { type: 'ISSUE', alert: mk(4, 'A2') })
  assert.deepEqual(s.alerts.map(a => a.id), ['A2', 'A1'])
  assert.equal(s.alerts[1].status, 'superseded')
  for (let i = 0; i < MAX_HISTORY + 5; i++) s = alertsReducer(s, { type: 'ISSUE', alert: mk(1, 'X' + i) })
  assert.equal(s.alerts.length, MAX_HISTORY)
})

test('village acknowledgements only count required villages', () => {
  let s = alertsReducer(initialState, { type: 'ISSUE', alert: mk(3, 'A1') })
  s = alertsReducer(s, { type: 'ACK_VILLAGE', id: 'A1', villageId: 'v1', at: 't' })
  s = alertsReducer(s, { type: 'ACK_VILLAGE', id: 'A1', villageId: 'v6', at: 't' }) // zone C, not required at level 3
  assert.deepEqual(ackProgress(s.alerts[0]), { done: 1, total: 4, pct: 25 })
  s = alertsReducer(s, { type: 'ACK_ALL_VILLAGES', id: 'A1', at: 't' })
  assert.deepEqual(ackProgress(s.alerts[0]), { done: 4, total: 4, pct: 100 })
  assert.equal(ackProgress(mk(1, 'L1')).pct, 100) // nothing required
})

test('clear history keeps the active alert only', () => {
  let s = alertsReducer(initialState, { type: 'ISSUE', alert: mk(2, 'A1') })
  s = alertsReducer(s, { type: 'ISSUE', alert: mk(3, 'A2') })
  s = alertsReducer(s, { type: 'CLEAR_HISTORY' })
  assert.deepEqual(s.alerts.map(a => a.id), ['A2'])
})

test('sanitizeLoadedState rejects malformed or non-simulated data', () => {
  assert.deepEqual(sanitizeLoadedState(null), initialState)
  assert.deepEqual(sanitizeLoadedState({ alerts: 'x' }), initialState)
  const good = mk(2, 'G')
  const real = { ...mk(2, 'R'), simulated: false }
  const out = sanitizeLoadedState({ alerts: [good, real, { junk: 1 }], activeId: 'G' })
  assert.deepEqual(out.alerts.map(a => a.id), ['G'])
  assert.equal(out.activeId, 'G')
  assert.equal(sanitizeLoadedState({ alerts: [good], activeId: 'nope' }).activeId, null)
})
