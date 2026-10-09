/**
 * READ-ONLY adapter to the existing VOLCANO ZERO app state.
 *
 * It only imports and reads. It never assigns to, calls, or mutates anything in
 * ../src, and it does not touch the prediction or risk-calculation logic.
 *
 * Note: opened as a standalone page, this page has its own copy of the app
 * modules, so values show the app's defaults (risk LOW). If the page is later
 * mounted inside the app (see INTEGRATION.md), the same imports read live state.
 */
import { S, RK } from '../src/core/data.js'
import { activeVolcano } from '../src/core/volcanoData.js'

export function readAppSnapshot() {
  try {
    const risk = Number.isInteger(S.risk) ? S.risk : 0
    return {
      available: true,
      volcanoName: activeVolcano.name,
      country: activeVolcano.country,
      authority: activeVolcano.alertAuthority,
      appRisk: risk,
      appRiskLabel: RK[risk] || 'UNKNOWN',
    }
  } catch {
    return {
      available: false,
      volcanoName: 'Demo Volcano',
      country: '—',
      authority: 'Demo Authority',
      appRisk: 0,
      appRiskLabel: 'UNAVAILABLE',
    }
  }
}
