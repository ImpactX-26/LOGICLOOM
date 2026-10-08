import { AGN, CC, HYC, HYN, KEYS, LV, META, RC, RK, S, UI, V, hooks, lvl } from '../core/data.js'
import { STN, ZN, mapEl, q } from '../scene/volcanoScene.js'
import { tele } from '../core/world.js'

/* ---------- Icons matching the UI screenshot ---------- */
export const ICONS = {
  seis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-7 4 14 3-7h6"/></svg>`,
  therm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
  gas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  cam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  wx: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8"/><path d="M8 13v8"/><path d="M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`
}

/* ---------- 5 Top Sensor Status Cards (Ref Image) ---------- */
export const topSensorCards = () => {
  return KEYS.map(k => {
    const m = META[k]
    const title = m[0]
    const badgeText = m[5]
    const subText = m[6]

    // Color definitions matching the screenshot
    let badgeColor = '#10b981' // green
    let iconBg = 'rgba(16, 185, 129, 0.15)'
    let iconBorder = 'rgba(16, 185, 129, 0.35)'

    if (k === 'seis') {
      badgeColor = '#f43f5e' // coral red
      iconBg = 'rgba(244, 63, 94, 0.15)'
      iconBorder = 'rgba(244, 63, 94, 0.35)'
    } else if (k === 'gas' || k === 'cam') {
      badgeColor = '#f59e0b' // amber
      iconBg = 'rgba(245, 158, 11, 0.15)'
      iconBorder = 'rgba(245, 158, 11, 0.35)'
    } else if (k === 'wx') {
      badgeColor = '#38bdf8' // blue
      iconBg = 'rgba(56, 189, 248, 0.15)'
      iconBorder = 'rgba(56, 189, 248, 0.35)'
    }

    return `
      <div class="top-metric-card" data-k="${k}">
        <div class="metric-icon-bubble" style="background:${iconBg};border-color:${iconBorder};color:${badgeColor}">
          ${ICONS[k]}
        </div>
        <div class="metric-body">
          <div class="metric-header-title">${title}</div>
          <div class="metric-status-badge" style="color:${badgeColor}">${badgeText}</div>
          <div class="metric-sub-detail">${subText}</div>
        </div>
        <div class="metric-arrow-btn">→</div>
      </div>
    `
  }).join('')
}

/* ---------- The Island Map Component (Center of Screenshot) ---------- */
export const islandMapCard = () => {
  return `
    <div class="island-map-container" id="island-map-box">
      <!-- Top Header Overlay -->
      <div class="map-top-overlay">
        <div class="map-loc-badge">
          <span class="map-loc-pin">📍</span>
          <div>
            <div class="map-loc-title">Volcano – Island A</div>
            <div class="map-loc-coords">12.3456° N, 98.7654° E</div>
          </div>
        </div>
        <div class="map-mode-pills">
          <button class="map-pill ${UI.mapType === 'map' ? 'active' : ''}" id="btn-switch-map" data-maptype="map">Map</button>
          <button class="map-pill ${UI.mapType === 'satellite' ? 'active' : ''}" id="btn-switch-sat" data-maptype="satellite">Satellite</button>
        </div>
      </div>

      <!-- Map Display Layer -->
      <div class="island-visual-frame" id="island-visual-slot">
        <img src="/volcano-island.jpg" alt="Volcano Island A" class="island-bg-img" id="island-img" />

        <!-- 5 Interactive On-Map Glowing Pins (Matching screenshot exactly) -->
        <div class="map-station-tag pin-seismic" data-k="seis">
          <div class="tag-icon" style="background:#f43f5e">${ICONS.seis}</div>
          <div class="tag-text">
            <span class="tag-title">Seismic</span>
            <span class="tag-status" style="color:#f43f5e">High</span>
          </div>
        </div>

        <div class="map-station-tag pin-thermal" data-k="therm">
          <div class="tag-icon" style="background:#10b981">${ICONS.therm}</div>
          <div class="tag-text">
            <span class="tag-title">Thermal</span>
            <span class="tag-status" style="color:#10b981">Normal</span>
          </div>
        </div>

        <div class="map-station-tag pin-camera" data-k="cam">
          <div class="tag-icon" style="background:#f59e0b">${ICONS.cam}</div>
          <div class="tag-text">
            <span class="tag-title">Camera</span>
            <span class="tag-status" style="color:#f59e0b">Smoke Detected</span>
          </div>
        </div>

        <div class="map-station-tag pin-gas" data-k="gas">
          <div class="tag-icon" style="background:#f59e0b">${ICONS.gas}</div>
          <div class="tag-text">
            <span class="tag-title">Gas</span>
            <span class="tag-status" style="color:#f59e0b">Elevated</span>
          </div>
        </div>

        <div class="map-station-tag pin-weather" data-k="wx">
          <div class="tag-icon" style="background:#38bdf8">${ICONS.wx}</div>
          <div class="tag-text">
            <span class="tag-title">Weather</span>
            <span class="tag-status" style="color:#38bdf8">Rainy</span>
          </div>
        </div>
      </div>

      <!-- Bottom Overlays: Compass Rose & Scale Bar -->
      <div class="map-bottom-overlay">
        <div class="compass-rose-box">
          <svg viewBox="0 0 40 40" width="36" height="36" class="compass-svg">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
            <polygon points="20,4 23,20 20,17 17,20" fill="#38bdf8"/>
            <polygon points="20,36 23,20 20,23 17,20" fill="rgba(255,255,255,0.4)"/>
            <polygon points="4,20 20,23 17,20 20,17" fill="rgba(255,255,255,0.3)"/>
            <polygon points="36,20 20,23 23,20 20,17" fill="rgba(255,255,255,0.3)"/>
            <text x="20" y="12" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="Inter">N</text>
          </svg>
        </div>
        <div class="scale-bar-box">
          <div class="scale-ticks">
            <span>0</span><span>1</span><span>2</span><span>3 km</span>
          </div>
          <div class="scale-line"></div>
        </div>
      </div>
    </div>
  `
}

/* ---------- Latest Alert Card (Right Column - Top) ---------- */
export const latestAlertCard = () => {
  return `
    <div class="sidebar-card">
      <div class="sidebar-card-header">
        <span class="header-icon-circle alert-red-ic">!</span>
        <span class="sidebar-card-title">Latest Alert</span>
      </div>
      <div class="alert-box-red" onclick="location.hash='#/app/alerts'">
        <div class="alert-box-symbol">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f43f5e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div class="alert-box-content">
          <div class="alert-box-headline">Seismic activity increased by 42%</div>
          <div class="alert-box-timestamp">Detected at 10:42 AM</div>
        </div>
        <div class="alert-box-arrow">→</div>
      </div>
      <a class="view-all-alerts-link" href="#/app/alerts">View all alerts →</a>
    </div>
  `
}

/* ---------- Current Hypotheses Card (Right Column - Middle) ---------- */
export const currentHypothesesCard = () => {
  return `
    <div class="sidebar-card">
      <div class="sidebar-card-header">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:16px;color:#38bdf8">🧠</span>
          <span class="sidebar-card-title">Current Hypotheses</span>
        </div>
        <span class="confidence-pill">Confidence</span>
      </div>
      <div class="hypotheses-list">
        ${HYN.map((n, i) => `
          <div class="hypo-item-row">
            <div class="hypo-name-col">
              <span class="hypo-dot" style="background:${HYC[i]}"></span>
              <span class="hypo-label">${n}</span>
            </div>
            <div class="hypo-bar-col">
              <div class="hypo-bar-track">
                <div class="hypo-bar-fill" style="width:${S.hy[i]}%;background:${HYC[i]}"></div>
              </div>
            </div>
            <div class="hypo-pct-col">${S.hy[i]}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

/* ---------- Next Recommended Action Card (Right Column - Bottom) ---------- */
export const nextRecommendedActionCard = () => {
  return `
    <div class="sidebar-card">
      <div class="sidebar-card-header">
        <span style="font-size:16px;color:#38bdf8">🎯</span>
        <span class="sidebar-card-title">Next Recommended Action</span>
      </div>
      <div class="action-box-blue" onclick="location.hash='#/app/missions'">
        <div class="action-box-drone-ic">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="6" height="6" rx="1"/>
            <path d="M3 3l4 4"/><path d="M21 3l-4 4"/><path d="M3 21l4-4"/><path d="M21 21l-4-4"/>
            <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
          </svg>
        </div>
        <div class="action-box-content">
          <div class="action-box-title">Collect additional gas data</div>
          <div class="action-box-desc">High information gain • Reduces uncertainty</div>
        </div>
        <div class="action-box-arrow">→</div>
      </div>
      <div class="view-mission-plan-wrapper">
        <a class="view-mission-plan-btn" href="#/app/missions">View Mission Plan →</a>
      </div>
    </div>
  `
}

/* ---------- Sensor Trends (Last 6 Hours) - Bottom Row ---------- */
export const sensorTrendsSection = () => {
  return `
    <div class="trends-bottom-container">
      <div class="trends-header">
        <span class="trends-header-ic">📈</span>
        <span class="trends-header-title">Sensor Trends <span class="trends-header-sub">(Last 6 Hours)</span></span>
      </div>
      <div class="trends-cards-grid">
        ${KEYS.map(k => {
          const m = META[k]
          const title = m[0].split('/')[0].split('(')[0].trim()
          const badgeText = m[5].split(' ')[0]
          const a = S.h[k]

          let strokeColor = '#10b981'
          if (k === 'seis') strokeColor = '#f43f5e'
          else if (k === 'gas' || k === 'cam') strokeColor = '#f59e0b'
          else if (k === 'wx') strokeColor = '#38bdf8'

          return `
            <div class="trend-box-card" data-k="${k}">
              <div class="trend-box-top">
                <span class="trend-box-name">${title}</span>
                <span class="trend-box-dot-status" style="color:${strokeColor}">● ${badgeText}</span>
              </div>
              <div class="trend-box-svg-wrap">
                ${renderSmoothSparkline(a, strokeColor)}
              </div>
              <div class="trend-box-axis">
                <span>6 AM</span>
                <span>8 AM</span>
                <span>10 AM</span>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

/* ---------- Smooth Area Sparkline with Points ---------- */
export const renderSmoothSparkline = (arr, color) => {
  const w = 220
  const h = 60
  const min = Math.min(...arr) * 0.92
  const max = Math.max(...arr) * 1.08
  const range = max - min || 1

  const points = arr.map((v, i) => {
    const x = (i * w / (arr.length - 1)).toFixed(1)
    const y = (h - 4 - ((v - min) / range) * (h - 14)).toFixed(1)
    return `${x},${y}`
  })

  const d = points.join(' ')
  const lastPoint = points[points.length - 1].split(',')

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" class="sparkline-svg">
      <defs>
        <linearGradient id="grad-${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Area fill -->
      <polygon fill="url(#grad-${color.replace('#','')})" points="0,${h} ${d} ${w},${h}"/>
      <!-- Stroke line -->
      <polyline fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${d}"/>
      <!-- Current value dot -->
      <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>
    </svg>
  `
}

/* ---------- Fill Dashboard Orchestration ---------- */
export function fillDash() {
  const se = (id, html) => {
    const el = document.getElementById(id)
    if (el) el.innerHTML = html
  }

  se('top-sensors-grid-slot', topSensorCards())
  se('island-map-slot', islandMapCard())
  se('latest-alert-card-slot', latestAlertCard())
  se('hypotheses-card-slot', currentHypothesesCard())
  se('next-action-card-slot', nextRecommendedActionCard())
  se('sensor-trends-row-slot', sensorTrendsSection())
}

/* ---------- Map UI Overlays ---------- */
export function ui() {
  // Keeps sync with active simulation state if 3D / Leaflet view is mounted
}

/* ---------- Legacy support exports for other pages ---------- */
export const sensRows = () => KEYS.map(k => {
  const m = META[k], l = lvl(k)
  return `<div class="sr" data-k="${k}">
    <div class="sr-body"><div class="sr-label">${m[0]}</div><b>${m[3](S.cur[k])}</b></div>
    <span class="status-pill">${m[5]}</span>
  </div>`
}).join('')

export const hypH = () => HYN.map((n, i) => `
  <div class="hyp-row">
    <span class="hyp-dot" style="background:${HYC[i]}"></span>
    <span class="hyp-label">${n}</span>
    <div class="bar-wrap"><div class="bar-fill" style="width:${S.hy[i]}%;background:${HYC[i]}"></div></div>
    <span class="hyp-pct">${S.hy[i]}%</span>
  </div>`).join('')

export const actH = () => S.act.map((a, i) => `<div class="ac"><i>${i+1}</i><span>${a}</span></div>`).join('')
export const tlH = () => S.tl.map(e => `<div class="te"><span class="mu">${e.t}</span><span>${e.m}</span></div>`).join('')
export const agH = () => AGN.map(a => `<div><i></i><span>${a[0]}: ${a[1]}</span></div>`).join('')
export const igH = () => S.ig.map(x => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')
export const chart = (a, col) => renderSmoothSparkline(a, col)
