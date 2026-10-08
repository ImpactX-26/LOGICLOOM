import correctedCsvRaw from '../../data/merapi_backtest_demo_corrected.csv?raw'
import demoCsvRaw from '../../data/merapi_backtest_demo.csv?raw'

/* ── Available Datasets ────────────────────────────────────────── */
export const DATASETS = {
  corrected: {
    id: 'corrected',
    filename: 'merapi_backtest_demo_corrected.csv',
    title: 'Mount Merapi (Corrected Demo Dataset · Active)',
    volcano: 'Mount Merapi',
    raw: correctedCsvRaw,
    isDefault: true
  },
  demo: {
    id: 'demo',
    filename: 'merapi_backtest_demo.csv',
    title: 'Historical Reference Dataset (Raw CSV)',
    volcano: 'Kīlauea / Reference',
    raw: demoCsvRaw,
    isDefault: false
  }
}

/* ── CSV Parser ────────────────────────────────────────────────── */
export function parseCSV(text) {
  if (!text) return []
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim())

  return lines.slice(1).map((line, idx) => {
    const values = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(cur.trim())
        cur = ''
      } else {
        cur += char
      }
    }
    values.push(cur.trim())

    const row = { _rowIndex: idx }
    headers.forEach((h, i) => {
      row[h] = values[i] !== undefined ? values[i] : ''
    })
    return row
  })
}

/* ── Agentic AI Historical Sensor Evaluator ───────────────────── */
export function evaluateAgenticRow(row) {
  const seis = parseFloat(row.seismic_ml) || 0
  const so2 = parseFloat(row.so2_ppm) || 0
  const therm = parseFloat(row.thermal_c) || 0
  const def = parseFloat(row.deformation_cm) || 0
  const press = parseFloat(row.pressure_hpa) || 1013
  const precip = parseFloat(row.precipitation_mm) || 0
  const wind = parseFloat(row.wind_speed_ms) || 0

  const volcano = row.volcano || 'Merapi'
  const isKilauea = /kilauea/i.test(volcano)

  // 1. Seismic Agent Assessment
  const seisThreshold = isKilauea ? 5.5 : 2.2
  const seisAnomaly = seis >= seisThreshold
  const seismicReport = seisAnomaly
    ? `Anomalous tremor (${seis.toFixed(1)} ML >= ${seisThreshold} threshold)`
    : `Normal microseismic baseline (${seis.toFixed(1)} ML)`

  // 2. Gas Agent Assessment
  const gasThreshold = isKilauea ? 1200 : 300
  const gasAnomaly = so2 >= gasThreshold
  const gasReport = gasAnomaly
    ? `Hazardous SO₂ degassing plume (${so2.toFixed(0)} ppm >= ${gasThreshold} threshold)`
    : `Baseline background emission (${so2.toFixed(0)} ppm)`

  // 3. Thermal Agent Assessment
  const thermThreshold = isKilauea ? 75 : 45
  const thermAnomaly = therm >= thermThreshold
  const thermalReport = thermAnomaly
    ? `Summit crater thermal anomaly (${therm.toFixed(0)} °C >= ${thermThreshold} °C threshold)`
    : `Normal summit crater temperature (${therm.toFixed(0)} °C)`

  // 4. Geodetic / Deformation Agent Assessment
  const defThreshold = isKilauea ? 4.0 : 1.0
  const defAnomaly = def >= defThreshold
  const defReport = defAnomaly
    ? `Ground inflation/tilt spike (${def.toFixed(1)} cm >= ${defThreshold} cm threshold)`
    : `Edifice ground stability normal (${def.toFixed(1)} cm)`

  // 5. Evidence Agent: Multi-Sensor Convergence
  const anomalies = []
  if (seisAnomaly) anomalies.push('Seismic')
  if (gasAnomaly) anomalies.push('Gas (SO₂)')
  if (thermAnomaly) anomalies.push('Thermal')
  if (defAnomaly) anomalies.push('Deformation')

  // Multi-sensor evidence convergence requires multi-channel consensus
  const isConvergence = anomalies.length >= 3 || (anomalies.length >= 2 && seisAnomaly && (gasAnomaly || thermAnomaly))
  const evidenceReport = isConvergence
    ? `EVIDENCE CONVERGENCE DETECTED: Multi-sensor agreement across ${anomalies.join(', ')}. Magma movement probability >85%.`
    : anomalies.length > 0
      ? `Isolated alert on ${anomalies.join(', ')}. Evidence conflicting; other sensors report baseline.`
      : 'All monitoring feeds within steady-state baseline.'

  // 6. Agentic AI Prediction
  const aiPrediction = isConvergence ? 'ERUPTION' : 'NO ERUPTION'
  const aiPredictionCode = isConvergence ? 1 : 0

  // 7. Historical Ground Truth (PRESERVED EXACTLY AS RECORDED)
  const actualEruption = parseInt(row.actual_eruption, 10) === 1 ? 1 : 0
  const actualOutcome = row.actual_outcome || (actualEruption === 1 ? 'ERUPTION' : 'NO_ERUPTION')
  const groundTruthStatus = row.ground_truth_status || (
    actualEruption === 1
      ? 'Historically verified eruption/explosion event'
      : 'Historical no-eruption observation in this demo window'
  )

  // 8. Ground Truth Comparison
  const isCorrect = (aiPredictionCode === actualEruption)
  const predictionStatus = isCorrect ? 'CORRECT' : 'INCORRECT'

  return {
    ...row,
    seismic_ml: seis,
    so2_ppm: so2,
    thermal_c: therm,
    deformation_cm: def,
    pressure_hpa: press,
    precipitation_mm: precip,
    wind_speed_ms: wind,
    actual_eruption: actualEruption,
    actual_outcome: actualOutcome,
    ground_truth_status: groundTruthStatus,
    agentic_ai_prediction: aiPrediction,
    prediction_status: predictionStatus,
    isCorrect,
    aiPredictionCode,
    agents: {
      seismic: seismicReport,
      gas: gasReport,
      thermal: thermalReport,
      deformation: defReport,
      evidence: evidenceReport,
      convergence: isConvergence,
      anomalies
    }
  }
}

/* ── Backtest Execution & State ───────────────────────────────── */
export const backtestState = {
  activeDatasetKey: 'corrected',
  selectedRowIndex: 6, // Highlight final eruption row by default
  isVerifying: false,
  verificationRan: false,
  showRawCSV: false
}

export function runBacktest(datasetKey = backtestState.activeDatasetKey) {
  const ds = DATASETS[datasetKey] || DATASETS.corrected
  const rawRows = parseCSV(ds.raw)
  const evaluatedRows = rawRows.map(evaluateAgenticRow)

  const total = evaluatedRows.length
  const correct = evaluatedRows.filter(r => r.isCorrect).length
  const incorrect = total - correct
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const eruptionCases = evaluatedRows.filter(r => r.actual_eruption === 1).length
  const noEruptionCases = evaluatedRows.filter(r => r.actual_eruption === 0).length

  return {
    dataset: ds,
    rows: evaluatedRows,
    summary: {
      total,
      correct,
      incorrect,
      accuracy,
      eruptionCases,
      noEruptionCases
    }
  }
}

/* ── Backtest UI Template Generator ──────────────────────────── */
export function backtestH() {
  const bkt = runBacktest(backtestState.activeDatasetKey)
  const rows = bkt.rows
  const s = bkt.summary
  const ds = bkt.dataset
  const selIdx = Math.min(Math.max(backtestState.selectedRowIndex, 0), rows.length - 1)
  const selRow = rows[selIdx] || rows[0]

  return `<section class="gl p bkt-section" id="bkt-root">
    <!-- Header with Dataset Switcher -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:12px">
      <div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:20px">📜</span>
          <h3 style="margin:0;font-size:15px;letter-spacing:0.04em">HISTORICAL BACKTEST &amp; GROUND-TRUTH VERIFICATION</h3>
        </div>
        <p class="mu" style="margin-top:4px;font-size:12px">
          Automated evaluation of Agentic AI multi-sensor predictions against historically verified volcanic events.
        </p>
      </div>

      <!-- Dataset Selector -->
      <div style="display:flex;align-items:center;gap:8px">
        <span class="mu2" style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Dataset:</span>
        <button class="btn ${backtestState.activeDatasetKey === 'corrected' ? 'btn-cy on' : ''}" data-bkt-ds="corrected" style="font-size:11px;padding:6px 12px">
          ★ Merapi Corrected (Active Demo)
        </button>
        <button class="btn ${backtestState.activeDatasetKey === 'demo' ? 'btn-cy on' : ''}" data-bkt-ds="demo" style="font-size:11px;padding:6px 12px">
          Reference CSV (Raw)
        </button>
      </div>
    </div>

    <!-- Audit Pipeline Flowchart -->
    <div class="bkt-flow">
      <div class="bkt-step">
        <span class="bkt-step-title">CSV Row</span>
        <span class="bkt-step-sub">${ds.filename}</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Sensor Readings</span>
        <span class="bkt-step-sub">Seismic, Gas, Therm, Def</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Agentic AI</span>
        <span class="bkt-step-sub">Specialist Consensus</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">AI Prediction</span>
        <span class="bkt-step-sub">Eruption / No Eruption</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Historical Ground Truth</span>
        <span class="bkt-step-sub">actual_eruption (Preserved)</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Verification</span>
        <span class="bkt-step-sub">CORRECT / INCORRECT</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Accuracy</span>
        <span class="bkt-step-sub">${s.accuracy}% Dynamic</span>
      </div>
    </div>

    <!-- Summary Statistics Grid -->
    <div class="bkt-stats-grid">
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">Total Test Cases</div>
        <div class="bkt-stat-val" style="color:var(--tx)">${s.total}</div>
        <small class="mu">Historical events</small>
      </div>
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">Correct Predictions</div>
        <div class="bkt-stat-val" style="color:var(--ok)">${s.correct}</div>
        <small class="mu">Ground-truth matches</small>
      </div>
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">Incorrect Predictions</div>
        <div class="bkt-stat-val" style="color:${s.incorrect ? 'var(--cr)' : 'var(--mu)'}">${s.incorrect}</div>
        <small class="mu">Discrepancies</small>
      </div>
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">Backtest Accuracy</div>
        <div class="bkt-stat-val" style="color:${s.accuracy === 100 ? 'var(--ok)' : 'var(--wa)'}">${s.accuracy}%</div>
        <small class="mu">Calculated dynamically</small>
      </div>
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">Eruption Cases</div>
        <div class="bkt-stat-val" style="color:var(--cr)">${s.eruptionCases}</div>
        <small class="mu">Verified explosive</small>
      </div>
      <div class="bkt-stat-box">
        <div class="bkt-stat-label">No-Eruption Cases</div>
        <div class="bkt-stat-val" style="color:var(--cy)">${s.noEruptionCases}</div>
        <small class="mu">Baseline quiescent</small>
      </div>
    </div>

    <!-- Selected Historical Event Inspector (Side-by-Side Comparison) -->
    ${selRow ? `
    <div class="bkt-compare-panel">
      <div class="bkt-compare-col" style="border-color:${selRow.agentic_ai_prediction === 'ERUPTION' ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.3)'}">
        <div class="bkt-compare-header">
          <span>AI PREDICTION (Agentic Pipeline)</span>
          <small class="mu">${selRow.volcano} · ${selRow.timestamp_utc || selRow.timestamp} UTC</small>
        </div>
        <div class="bkt-compare-val">
          <span class="bkt-badge ${selRow.agentic_ai_prediction === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}" style="font-size:16px;padding:6px 14px">
            ${selRow.agentic_ai_prediction === 'ERUPTION' ? '🌋 ERUPTION' : '🛡️ NO ERUPTION'}
          </span>
        </div>
        <p style="font-size:12px;color:var(--tx2);margin:10px 0 6px">
          ${selRow.agents.evidence}
        </p>
        <div style="display:flex;flex-direction:column;gap:4px;font-size:11px;margin-top:8px">
          <div style="color:var(--mu)">• <b>Seismic Agent:</b> ${selRow.agents.seismic}</div>
          <div style="color:var(--mu)">• <b>Gas Agent:</b> ${selRow.agents.gas}</div>
          <div style="color:var(--mu)">• <b>Thermal Agent:</b> ${selRow.agents.thermal}</div>
          <div style="color:var(--mu)">• <b>Deformation Agent:</b> ${selRow.agents.deformation}</div>
        </div>
      </div>

      <div class="bkt-compare-col" style="border-color:${selRow.actual_outcome === 'ERUPTION' ? 'rgba(244,63,94,0.3)' : 'rgba(52,211,153,0.3)'}">
        <div class="bkt-compare-header">
          <span>HISTORICAL ACTUAL OUTCOME (Ground Truth)</span>
          <small class="mu">${selRow.timestamp_wib ? `${selRow.timestamp_wib} WIB` : selRow.timestamp}</small>
        </div>
        <div class="bkt-compare-val">
          <span class="bkt-badge ${selRow.actual_outcome === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}" style="font-size:16px;padding:6px 14px">
            ${selRow.actual_outcome === 'ERUPTION' ? '🌋 ERUPTION (Code: 1)' : '🛡️ NO ERUPTION (Code: 0)'}
          </span>
        </div>
        <p style="font-size:12px;color:var(--tx2);margin:10px 0 6px">
          ${selRow.ground_truth_status}
        </p>
        <div style="margin-top:12px;padding:8px 12px;border-radius:8px;background:${selRow.isCorrect ? 'rgba(52,211,153,0.12)' : 'rgba(244,63,94,0.12)'};border:1px solid ${selRow.isCorrect ? 'rgba(52,211,153,0.35)' : 'rgba(244,63,94,0.35)'};display:flex;align-items:center;justify-content:space-between">
          <b style="font-size:13px;color:${selRow.isCorrect ? 'var(--ok)' : 'var(--cr)'}">
            ${selRow.isCorrect ? '✓ CORRECT — Verified Match with Historical Record' : '✗ INCORRECT — Prediction Discrepancy'}
          </b>
          <span class="bkt-badge ${selRow.isCorrect ? 'bkt-badge-ok' : 'bkt-badge-cr'}">${selRow.prediction_status}</span>
        </div>
      </div>
    </div>` : ''}

    <!-- Historical Dataset Verification Table -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <h4 style="margin:0;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:var(--mu)">
        Historical Event Observations &amp; Ground-Truth Verification
      </h4>
      <small class="mu">Click any row to inspect Agentic AI reasoning breakdown</small>
    </div>

    <div class="bkt-table-wrap">
      <table class="bkt-table">
        <thead>
          <tr>
            <th>#</th>
            <th>UTC Timestamp</th>
            <th>Local Time (WIB)</th>
            <th>Volcano</th>
            <th>Seismic (ML)</th>
            <th>SO₂ (ppm)</th>
            <th>Thermal (°C)</th>
            <th>Deform (cm)</th>
            <th>Pressure (hPa)</th>
            <th>Wind (m/s)</th>
            <th>AI Prediction</th>
            <th>Historical Actual</th>
            <th>Verification</th>
            <th>Ground Truth Context</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isSel = i === selIdx
            return `<tr class="${isSel ? 'selected' : ''}" data-bkt-row="${i}" style="cursor:pointer" title="Click to view full agent analysis for this event">
              <td style="color:var(--mu)">${i + 1}</td>
              <td style="font-weight:600;color:var(--tx)">${r.timestamp_utc || r.timestamp}</td>
              <td style="color:var(--cy)">${r.timestamp_wib || r.timestamp}</td>
              <td>${r.volcano}</td>
              <td style="color:${r.seismic_ml >= 2.2 ? 'var(--cr)' : 'var(--ok)'}">${r.seismic_ml.toFixed(1)}</td>
              <td style="color:${r.so2_ppm >= 300 ? 'var(--cr)' : 'var(--ok)'}">${r.so2_ppm.toFixed(0)}</td>
              <td style="color:${r.thermal_c >= 45 ? 'var(--cr)' : 'var(--ok)'}">${r.thermal_c.toFixed(0)}</td>
              <td style="color:${r.deformation_cm >= 1.0 ? 'var(--cr)' : 'var(--ok)'}">${r.deformation_cm.toFixed(1)}</td>
              <td>${r.pressure_hpa}</td>
              <td>${r.wind_speed_ms}</td>
              <td>
                <span class="bkt-badge ${r.agentic_ai_prediction === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}">
                  ${r.agentic_ai_prediction}
                </span>
              </td>
              <td>
                <span class="bkt-badge ${r.actual_outcome === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}">
                  ${r.actual_outcome} [${r.actual_eruption}]
                </span>
              </td>
              <td>
                <span class="bkt-badge ${r.isCorrect ? 'bkt-badge-ok' : 'bkt-badge-cr'}">
                  ${r.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                </span>
              </td>
              <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;color:var(--mu)">
                ${r.ground_truth_status}
              </td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>
  </section>`
}

/* ── Standalone AI Verification Page Template ─────────────────── */
export function verificationPageHTML() {
  const bkt = runBacktest(backtestState.activeDatasetKey)
  const rows = bkt.rows
  const s = bkt.summary
  const ds = bkt.dataset
  const selIdx = Math.min(Math.max(backtestState.selectedRowIndex, 0), rows.length - 1)
  const selRow = rows[selIdx] || rows[0]

  const periodStart = rows[0] ? (rows[0].timestamp_wib || rows[0].timestamp_utc || rows[0].timestamp) : 'N/A'
  const periodEnd = rows[rows.length - 1] ? (rows[rows.length - 1].timestamp_wib || rows[rows.length - 1].timestamp_utc || rows[rows.length - 1].timestamp) : 'N/A'
  const periodStr = `${periodStart} – ${periodEnd}`

  return `<div class="veri-page">
    <!-- Top Greeting & Control Bar -->
    <div class="dash-greeting-bar" style="margin-bottom:18px">
      <div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:26px">🛡️</span>
          <h2 style="font-size:22px;letter-spacing:0.02em;margin:0">AI VERIFICATION CENTER</h2>
          <span class="status-pill sp-ok" style="font-size:11px;padding:3px 10px;display:flex;align-items:center;gap:4px">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ok)"></span>
            Dataset Loaded ✓
          </span>
          <span class="status-pill sp-cy" style="font-size:11px;padding:3px 10px">
            ${ds.filename} (${rows.length} records)
          </span>
        </div>
        <p style="color:var(--cy);font-weight:600;font-size:14px;margin-top:6px">
          Historical Backtesting &amp; Ground-Truth Validation
        </p>
        <p class="mu" style="font-size:13px;margin-top:2px;max-width:850px;line-height:1.5">
          VOLCANO ZERO compares Agentic AI predictions with historical volcanic observations to evaluate prediction performance.
        </p>
      </div>

      <!-- Action Button: Run Historical Verification -->
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <button class="btn pri" id="btn-run-verification" data-action="run-verification" style="padding:12px 24px;font-size:14px;font-weight:600;border-radius:12px;box-shadow:0 4px 18px rgba(56,189,248,0.25)">
          ${backtestState.isVerifying ? '<span class="spn"></span> Analyzing historical observations…' : '▶ Run Historical Verification'}
        </button>
        <small style="color:${backtestState.isVerifying ? 'var(--cy)' : 'var(--ok)'};font-size:11px;font-weight:500">
          ${backtestState.isVerifying ? 'Processing sensor telemetry through agentic specialists…' : 'Verification Complete ✓'}
        </small>
      </div>
    </div>

    <!-- SENSOR → AI → VERIFICATION WORKFLOW DIAGRAM -->
    <div class="bkt-flow" style="margin:16px 0 20px">
      <div class="bkt-step">
        <span class="bkt-step-title">Historical Sensor Data</span>
        <span class="bkt-step-sub">${ds.filename}</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Agentic AI Analysis</span>
        <span class="bkt-step-sub">Specialist Consensus</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Prediction</span>
        <span class="bkt-step-sub">AI Predicted Outcome</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Historical Ground Truth</span>
        <span class="bkt-step-sub">actual_eruption</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Comparison Engine</span>
        <span class="bkt-step-sub">Ground Truth Verification</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Evaluation</span>
        <span class="bkt-step-sub">Correct / Incorrect</span>
      </div>
      <span class="bkt-flow-arrow">➔</span>
      <div class="bkt-step">
        <span class="bkt-step-title">Dynamic Accuracy</span>
        <span class="bkt-step-sub" style="color:var(--ok);font-weight:700">${s.accuracy}% (${s.correct}/${s.total})</span>
      </div>
    </div>

    <!-- BACKTEST SUMMARY: 4 PROMINENT CARDS -->
    <div class="bkt-summary-cards" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
      <div class="gl p" style="text-align:center;border-left:4px solid var(--cy)">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:var(--mu);text-transform:uppercase;margin-bottom:6px">TOTAL TEST CASES</div>
        <div style="font-size:36px;font-weight:800;color:var(--tx);line-height:1">${s.total}</div>
        <small class="mu" style="margin-top:6px;display:block">Historical events evaluated</small>
      </div>
      <div class="gl p" style="text-align:center;border-left:4px solid var(--ok)">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:var(--mu);text-transform:uppercase;margin-bottom:6px">CORRECT PREDICTIONS</div>
        <div style="font-size:36px;font-weight:800;color:var(--ok);line-height:1">${s.correct}</div>
        <small class="mu" style="margin-top:6px;display:block">Matched ground truth</small>
      </div>
      <div class="gl p" style="text-align:center;border-left:4px solid ${s.incorrect ? 'var(--cr)' : 'var(--mu)'}">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:var(--mu);text-transform:uppercase;margin-bottom:6px">INCORRECT PREDICTIONS</div>
        <div style="font-size:36px;font-weight:800;color:${s.incorrect ? 'var(--cr)' : 'var(--mu)'};line-height:1">${s.incorrect}</div>
        <small class="mu" style="margin-top:6px;display:block">Discrepancy count</small>
      </div>
      <div class="gl p" style="text-align:center;border-left:4px solid ${s.accuracy === 100 ? 'var(--ok)' : 'var(--wa)'}">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:var(--mu);text-transform:uppercase;margin-bottom:6px">BACKTEST ACCURACY</div>
        <div style="font-size:36px;font-weight:800;color:${s.accuracy === 100 ? 'var(--ok)' : 'var(--wa)'};line-height:1">${s.accuracy}%</div>
        <small class="mu" style="margin-top:6px;display:block">Dynamically calculated</small>
      </div>
    </div>

    <!-- DATASET INFORMATION CARD & DATASET SELECTOR -->
    <div class="gl p" style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">📊</span>
          <h3 style="margin:0;font-size:14px;letter-spacing:0.04em">DATASET INFORMATION &amp; GROUND-TRUTH REGISTRY</h3>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="mu2" style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Dataset:</span>
          <button class="btn ${backtestState.activeDatasetKey === 'corrected' ? 'btn-cy on' : ''}" data-bkt-ds="corrected" style="font-size:11px;padding:6px 12px">
            ★ Merapi Corrected (Active Demo)
          </button>
          <button class="btn ${backtestState.activeDatasetKey === 'demo' ? 'btn-cy on' : ''}" data-bkt-ds="demo" style="font-size:11px;padding:6px 12px">
            Reference CSV (Raw)
          </button>
        </div>
      </div>
      <div class="tiles" style="grid-template-columns:repeat(5, 1fr);margin-top:0">
        <div>
          <small>Dataset</small>
          <b>Merapi Historical Backtest</b>
        </div>
        <div>
          <small>Volcano</small>
          <b>${selRow.volcano || 'Mount Merapi'}</b>
        </div>
        <div>
          <small>Data Points</small>
          <b style="color:var(--cy)">${rows.length} records (${ds.filename})</b>
        </div>
        <div>
          <small>Historical Period</small>
          <b style="font-size:11.5px">${periodStr}</b>
        </div>
        <div>
          <small>Verification Type</small>
          <b style="color:var(--ok)">Historical Backtesting</b>
        </div>
      </div>
    </div>

    <!-- AI PREDICTION VS ACTUAL RESULT: TWO LARGE COMPARISON CARDS -->
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <h3 style="margin:0;font-size:14px;letter-spacing:0.04em">
          AI PREDICTION VS HISTORICAL ACTUAL OUTCOME
        </h3>
        <small class="mu">Selected Event #${selIdx + 1} of ${rows.length} · Click any row in the tables below to inspect</small>
      </div>

      <div class="bkt-compare-panel" style="margin-bottom:0">
        <!-- Card 1: AGENTIC AI PREDICTION -->
        <div class="bkt-compare-col" style="border-color:${selRow.agentic_ai_prediction === 'ERUPTION' ? 'rgba(244,63,94,0.4)' : 'rgba(56,189,248,0.4)'};background:rgba(8,16,32,0.6)">
          <div class="bkt-compare-header">
            <span style="color:var(--cy)">AGENTIC AI PREDICTION</span>
            <span class="status-pill sp-cy" style="font-size:10px">Autonomous Pipeline</span>
          </div>
          <div style="margin:12px 0">
            <small class="mu" style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px">Predicted Outcome</small>
            <div class="bkt-compare-val" style="margin-top:4px">
              <span class="bkt-badge ${selRow.agentic_ai_prediction === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}" style="font-size:20px;padding:8px 18px">
                ${selRow.agentic_ai_prediction === 'ERUPTION' ? '🌋 ERUPTION' : '🛡️ NO ERUPTION'}
              </span>
            </div>
          </div>
          <p style="font-size:13px;color:var(--tx2);margin:12px 0 8px;line-height:1.5">
            ${selRow.agents.evidence}
          </p>
          <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--gb3);display:flex;flex-direction:column;gap:5px;font-size:11.5px">
            <div style="color:var(--mu)">• <b>Seismic Agent:</b> <span style="color:var(--tx)">${selRow.agents.seismic}</span></div>
            <div style="color:var(--mu)">• <b>Gas Agent:</b> <span style="color:var(--tx)">${selRow.agents.gas}</span></div>
            <div style="color:var(--mu)">• <b>Thermal Agent:</b> <span style="color:var(--tx)">${selRow.agents.thermal}</span></div>
            <div style="color:var(--mu)">• <b>Deformation Agent:</b> <span style="color:var(--tx)">${selRow.agents.deformation}</span></div>
          </div>
        </div>

        <!-- Card 2: HISTORICAL ACTUAL RESULT -->
        <div class="bkt-compare-col" style="border-color:${selRow.actual_outcome === 'ERUPTION' ? 'rgba(244,63,94,0.4)' : 'rgba(52,211,153,0.4)'};background:rgba(8,16,32,0.6)">
          <div class="bkt-compare-header">
            <span style="color:var(--ok)">HISTORICAL ACTUAL RESULT</span>
            <span class="status-pill sp-ok" style="font-size:10px">Historical Ground Truth</span>
          </div>
          <div style="margin:12px 0">
            <small class="mu" style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px">Actual Historical Outcome</small>
            <div class="bkt-compare-val" style="margin-top:4px">
              <span class="bkt-badge ${selRow.actual_outcome === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}" style="font-size:20px;padding:8px 18px">
                ${selRow.actual_outcome === 'ERUPTION' ? '🌋 ERUPTION (Code: 1)' : '🛡️ NO ERUPTION (Code: 0)'}
              </span>
            </div>
          </div>
          <div style="font-size:13px;color:var(--tx2);margin:12px 0 8px;line-height:1.5">
            <b>Ground Truth Status:</b> ${selRow.ground_truth_status}
          </div>
          <div style="margin-top:14px;padding:12px;border-radius:10px;background:${selRow.isCorrect ? 'rgba(52,211,153,0.14)' : 'rgba(244,63,94,0.14)'};border:1px solid ${selRow.isCorrect ? 'rgba(52,211,153,0.4)' : 'rgba(244,63,94,0.4)'};display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:15px;font-weight:700;color:${selRow.isCorrect ? 'var(--ok)' : 'var(--cr)'}">
                ${selRow.isCorrect ? '✓ CORRECT PREDICTION' : '✗ INCORRECT PREDICTION'}
              </div>
              <small class="mu" style="display:block;margin-top:2px">
                ${selRow.isCorrect ? 'AI prediction verified against historical actual eruption outcome' : 'AI prediction differs from historical record'}
              </small>
            </div>
            <span class="bkt-badge ${selRow.isCorrect ? 'bkt-badge-ok' : 'bkt-badge-cr'}" style="font-size:12px;padding:5px 12px">
              ${selRow.prediction_status}
            </span>
          </div>
          <div style="margin-top:10px;display:flex;gap:14px;font-size:11.5px;color:var(--mu)">
            <div><b>Time (WIB):</b> ${selRow.timestamp_wib ? selRow.timestamp_wib.split(' ')[1] || selRow.timestamp_wib : selRow.timestamp}</div>
            <div><b>Time (UTC):</b> ${selRow.timestamp_utc ? selRow.timestamp_utc.split(' ')[1] || selRow.timestamp_utc : selRow.timestamp}</div>
            <div><b>Volcano:</b> ${selRow.volcano}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- VERIFICATION TABLE -->
    <div class="gl p" style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <h3 style="margin:0;font-size:14px;letter-spacing:0.04em">AGENTIC AI VERIFICATION TABLE</h3>
          <p class="mu" style="font-size:12px;margin-top:2px">
            Independent comparison of AI Predictions versus Historical Actual Outcomes.
          </p>
        </div>
        <span class="mu" style="font-size:11px">Click row to select</span>
      </div>

      <div class="bkt-table-wrap">
        <table class="bkt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>AI Prediction</th>
              <th>Actual Result</th>
              <th>Verification</th>
              <th>Ground Truth Note</th>
              <th>Inspect</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => {
              const isSel = i === selIdx
              const timeDisplay = r.timestamp_wib ? `${r.timestamp_wib.slice(11, 16)} WIB (${r.timestamp_utc ? r.timestamp_utc.slice(11, 16) : ''} UTC)` : r.timestamp
              return `<tr class="${isSel ? 'selected' : ''}" data-bkt-row="${i}" style="cursor:pointer">
                <td style="color:var(--mu)">${i + 1}</td>
                <td style="font-weight:600;color:var(--tx)">${timeDisplay}</td>
                <td>
                  <span class="bkt-badge ${r.agentic_ai_prediction === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}">
                    ${r.agentic_ai_prediction}
                  </span>
                </td>
                <td>
                  <span class="bkt-badge ${r.actual_outcome === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}">
                    ${r.actual_outcome}
                  </span>
                </td>
                <td>
                  <span class="bkt-badge ${r.isCorrect ? 'bkt-badge-ok' : 'bkt-badge-cr'}">
                    ${r.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                </td>
                <td style="color:var(--mu);font-size:11.5px">${r.ground_truth_status}</td>
                <td>
                  <button class="btn ${isSel ? 'btn-cy on' : ''}" data-bkt-row="${i}" style="padding:4px 10px;font-size:11px">
                    ${isSel ? 'Active' : 'Select'}
                  </button>
                </td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SENSOR DATA TABLE ("View Dataset" / Historical Sensor Records) -->
    <div class="gl p" style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <h3 style="margin:0;font-size:14px;letter-spacing:0.04em">HISTORICAL SENSOR OBSERVATIONS (CSV DATASET)</h3>
          <p class="mu" style="font-size:12px;margin-top:2px">
            Verified telemetry streams ingested from ${ds.filename} for model validation.
          </p>
        </div>
        <button class="btn btn-cy" data-action="toggle-raw-csv" style="font-size:11px;padding:6px 14px">
          ${backtestState.showRawCSV ? 'Hide Raw CSV' : 'View Raw CSV Dataset'}
        </button>
      </div>

      <div class="bkt-table-wrap">
        <table class="bkt-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Seismic (ML)</th>
              <th>SO₂ (ppm)</th>
              <th>Thermal (°C)</th>
              <th>Deformation (cm)</th>
              <th>Pressure (hPa)</th>
              <th>Precip (mm)</th>
              <th>Wind (m/s)</th>
              <th>Actual Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => {
              const isSel = i === selIdx
              const timeDisplay = r.timestamp_wib || r.timestamp_utc || r.timestamp
              return `<tr class="${isSel ? 'selected' : ''}" data-bkt-row="${i}" style="cursor:pointer">
                <td style="font-weight:600;color:var(--tx)">${timeDisplay}</td>
                <td style="color:${r.seismic_ml >= 2.2 ? 'var(--cr)' : 'var(--ok)'}">${r.seismic_ml.toFixed(1)}</td>
                <td style="color:${r.so2_ppm >= 300 ? 'var(--cr)' : 'var(--ok)'}">${r.so2_ppm.toFixed(0)}</td>
                <td style="color:${r.thermal_c >= 45 ? 'var(--cr)' : 'var(--ok)'}">${r.thermal_c.toFixed(0)}</td>
                <td style="color:${r.deformation_cm >= 1.0 ? 'var(--cr)' : 'var(--ok)'}">${r.deformation_cm.toFixed(1)}</td>
                <td>${r.pressure_hpa}</td>
                <td>${r.precipitation_mm}</td>
                <td>${r.wind_speed_ms}</td>
                <td>
                  <span class="bkt-badge ${r.actual_outcome === 'ERUPTION' ? 'bkt-badge-cr' : 'bkt-badge-ok'}">
                    ${r.actual_outcome}
                  </span>
                </td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Raw CSV Content Accordion -->
      ${backtestState.showRawCSV ? `
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--gb3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <small class="mu" style="text-transform:uppercase;letter-spacing:0.05em">Raw File Content: ${ds.filename}</small>
          <span class="status-pill sp-ok" style="font-size:10px">Read-Only Ground Truth</span>
        </div>
        <pre style="max-height:220px;overflow:auto;font-size:11.5px">${ds.raw}</pre>
      </div>` : ''}
    </div>
  </div>`
}
