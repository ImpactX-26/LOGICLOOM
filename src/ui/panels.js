import { AGN, CC, HYC, HYN, KEYS, LV, META, RC, RK, S, UI, V, hooks, lvl } from '../core/data.js'
import { STN, ZN, mapEl, q } from '../scene/volcanoScene.js'
import { tele } from '../core/world.js'
import { activeVolcano } from '../core/volcanoData.js'

/* ---------- Icon map for sensors ---------- */
export const ICONS = {
  seis: '〰',   // seismic wave
  gas: '☁',    // gas cloud
  therm: '🌡',  // thermometer
  def: '⛰',    // mountain / ground
  wx: '💨'     // wind
}

export const BG_CLS = ['ok-bg', 'wa-bg', 'cr-bg']
export const PIL_CLS = ['sp-ok', 'sp-wa', 'sp-cr']
export const MC_CLS  = ['ok-c',  'wa-c',  'cr-c']

/* ---------- Spark SVG ---------- */
export const spark = (a, col, w = 90, h = 26) => {
  const mn = Math.min(...a), r = (Math.max(...a) - mn) || 1
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><polyline fill="none" stroke="${col}" stroke-width="1.6" points="${a.map((v,i) => (i*w/(a.length-1)).toFixed(1)+','+(h-2-(v-mn)/r*(h-4)).toFixed(1)).join(' ')}"/></svg>`
}

/* ---------- Full chart SVG ---------- */
export const chart = (a, col) => {
  const w = 640, h = 220, mn = Math.min(...a) * 0.9, r = (Math.max(...a) * 1.1 - mn) || 1
  const d = a.map((v, i) => (i * w / (a.length - 1)).toFixed(1) + ',' + (h - 10 - (v - mn) / r * (h - 30)).toFixed(1)).join(' ')
  return `<div class="chart-wrap"><svg viewBox="0 0 ${w} ${h}" width="100%" height="220" preserveAspectRatio="none"><polygon fill="${col}" opacity=".15" points="0,${h} ${d} ${w},${h}"/><polyline fill="none" stroke="${col}" stroke-width="2.5" points="${d}"/></svg></div>`
}

/* ---------- Sensor rows (sidebar + sensors page) ---------- */
export const sensRows = () => KEYS.map(k => {
  const m = META[k], l = lvl(k)
  const on = k === UI.sel && V.page === 'sensors' ? ' on' : ''
  return `<div class="sr${on}" data-k="${k}">
    <div class="sr-icon ${BG_CLS[l]}">${ICONS[k]}</div>
    <div class="sr-body">
      <div class="sr-label">${m[0]}</div>
      <div class="sr-val" style="color:${CC[l]}">${m[3](S.cur[k])}</div>
    </div>
    <div class="sr-right">
      <span class="status-pill ${PIL_CLS[l]}">${LV[l]}</span>
      ${spark(S.h[k], CC[l])}
    </div>
  </div>`
}).join('')

/* ---------- Hypothesis bars ---------- */
export const hypH = () => HYN.map((n, i) => `
  <div class="hyp-row">
    <span class="hyp-dot" style="background:${HYC[i]}"></span>
    <span class="hyp-label">${n}</span>
    <div class="bar-wrap"><div class="bar-fill" style="width:${S.hy[i]}%;background:${HYC[i]}"></div></div>
    <span class="hyp-pct">${S.hy[i]}%</span>
  </div>`).join('')

/* ---------- Recommended actions ---------- */
export const actH = () => S.act.map((a, i) => `
  <div class="ac"><i>${i+1}</i><span>${a}</span></div>`).join('')

/* ---------- Timeline ---------- */
export const tlH = () => S.tl.length
  ? S.tl.map(e => `<div class="te"><i style="background:${['#38bdf8','#fbbf24','#f43f5e'][e.s]}"></i><span class="mu">${e.t}</span><span>${e.m}</span></div>`).join('')
  : '<p class="mu" style="font-size:12px">No events yet. Start the volcano scenario to watch the agents work.</p>'

/* ---------- Agent activity ---------- */
export const agH = () => AGN.map(a => `
  <div class="${a[0] in S.ag ? 'on' : ''}">
    <i></i>
    <span>${a[0]}${a[0] in S.ag ? ' — ' + S.ag[a[0]] : ''}</span>
  </div>`).join('')

/* ---------- Information-gain bars ---------- */
export const igH = () => S.ig
  ? S.ig.map((x, i) => `<div class="hb"><span>${x[0]}${i ? '' : ' ✔'}</span><div class="bar"><i style="width:${x[1]*100}%;background:${i ? '#38bdf8' : '#34d399'}"></i></div><b>${x[1]}</b></div>`).join('')
  : '<p class="mu" style="font-size:12px">Not evaluated yet. Runs when evidence conflicts.</p>'

/* ---------- Metric card (dashboard top strip) ---------- */
export const mcCard = k => {
  const m = META[k], l = lvl(k), v = S.cur[k]
  const cls = MC_CLS[l] || 'cy-c'
  const icCls = BG_CLS[l] || 'cy-bg'
  const a = S.h[k], last = a[23] - a[16], thr = m[4][0] * 0.015
  const trend = last > thr ? '↗ Rising' : last < -thr ? '↘ Falling' : '→ Stable'

  return `<div class="mc ${cls}" data-k="${k}">
    <div class="mc-top">
      <div class="mc-icon ${icCls}">${ICONS[k]}</div>
      <span class="mc-badge ${icCls}">${LV[l].toUpperCase()}</span>
    </div>
    <div class="mc-label">${m[0]}</div>
    <div class="mc-val" style="color:${CC[l]}">${m[3](v)}</div>
    <div class="mc-trend">
      <span class="mc-arrow" style="color:${CC[l]}">${trend}</span>
    </div>
  </div>`
}

/* ---------- Fill dashboard ---------- */
export function fillDash() {
  const se = (id, h) => { const e = document.getElementById(id); if (e) e.innerHTML = h }

  // Metric cards strip
  se('mc-strip', KEYS.map(mcCard).join(''))

  // Sensor sidebar
  se('sensP', `<div class="sens-header"><h3>Live Sensor Readings</h3><a class="sens-link" href="#/app/sensors">View All →</a></div>${sensRows()}`)

  // Hypotheses sidebar
  se('hyp', `<h3>Current Hypotheses <span style="float:right;font-size:10px;padding:2px 8px;border-radius:99px;border:1px solid var(--gb2);color:var(--cy);text-transform:none;letter-spacing:0">Confidence</span></h3>${hypH()}`)

  // Timeline
  const tl = document.getElementById('tl')
  if (tl) { tl.innerHTML = tlH(); tl.scrollTop = tl.scrollHeight }

  // Actions
  se('act', actH())
}

/* ---------- Map overlays ---------- */
export function ui() {
  if (!mapEl.isConnected) return
  const rc = RC[S.risk]

  // Status panel
  q('#stt').innerHTML = `<div class="ic" style="border-color:${rc};color:${rc}">▲</div>
    <div>
      <small>VOLCANO STATUS · ${activeVolcano.name.toUpperCase()}</small>
      <b style="color:${rc}">${S.st}</b>
      <em>Risk ${RK[S.risk]} · ${activeVolcano.country} · Coords: ${activeVolcano.coords[0].toFixed(2)}°, ${activeVolcano.coords[1].toFixed(2)}°</em>
    </div>`

  // Banner
  const b = q('#ban')
  if (b.dataset.t !== S.ban) {
    b.dataset.t = S.ban
    b.innerHTML = `<span class="bn">${S.ban}</span>`
  }

  // Agent panel
  q('#agp').innerHTML = `<div class="agp-title">AGENT ACTIVITY</div>${agH()}`

  // Go button
  const go = q('#go')
  go.textContent = S.run ? 'Scenario running…' : S.done ? '↻ Replay scenario' : '▶ Start Demo'
  go.disabled = !!S.run

  // Telemetry
  const tl = q('#tel'), d = tele()
  tl.hidden = !S.mn
  if (S.mn) tl.innerHTML = `
    <small>DRONE-01 · TELEMETRY</small>
    <p><span class="mu">Mission</span><b>${S.mn.split('—')[0].trim()}</b></p>
    <p><span class="mu">Status</span><b style="color:var(--cy)">${S.dst}</b></p>
    <p><span class="mu">Altitude</span><b>${d.alt} m</b></p>
    <p><span class="mu">Speed</span><b>${d.spd} m/s</b></p>
    <p><span class="mu">Battery</span><b style="color:${d.bat < 30 ? 'var(--wa)' : 'var(--ok)'}">${d.bat}%</b></p>
    <p><span class="mu">Signal</span><b>${d.sig}</b></p>`

  // Info panel
  const p = q('#info')
  if (!V.SEL) { p.hidden = true; return }
  p.hidden = false
  let h
  if (V.SEL.t === 'st') {
    const o = STN.find(x => x.id === V.SEL.id) || activeVolcano.stations.find(x => x.id === V.SEL.id)
    const stType = o?.k || o?.type || 'seis'
    const m = META[stType] || META.seis
    const l = lvl(stType)
    const a = S.h[stType]
    const dd = a[23] - a[16], e = m[4][0] * 0.02
    h = `<small>${(o?.n || o?.name || 'STATION').toUpperCase()}</small>
      <div class="mu">${o?.ty || o?.label || 'Sensor'} Node</div>
      <b class="big" style="color:${CC[l]}">${m[3](S.cur[stType])}</b>
      <div style="margin-top:4px"><span class="status-pill ${PIL_CLS[l]}">${LV[l]}</span></div>
      <small style="margin-top:6px;display:block">Updated ${V.CLK} · ${dd > e ? '↗ Rising' : dd < -e ? '↘ Falling' : '→ Stable'}</small>`
  } else if (V.SEL.t === 'dr') {
    const d2 = tele()
    h = `<small>DRONE-01</small>
      <b class="big" style="color:var(--cy)">${S.dst}</b>
      <div class="mu">${S.mn || 'No active mission'}</div>
      <small>Alt ${d2.alt} m · ${d2.spd} m/s · ${d2.bat}%</small>`
  } else {
    const z = ZN[V.SEL.i]
    h = `<small>${z[0]}</small>
      <b class="big">${S.risk >= 2 && V.SEL.i < 2 ? ['','','High','Critical'][S.risk] + ' risk' : V.SEL.i === 0 ? 'High risk' : V.SEL.i === 1 ? 'Moderate risk' : 'Monitoring'}</b>
      <div class="mu">${z[1]}</div>`
  }
  p.innerHTML = `<button class="x" data-c="x" aria-label="Close">×</button>${h}`
}

hooks.ui = ui
