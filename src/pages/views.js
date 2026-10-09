import { CC, HYN, KEYS, LV, META, MST, O, RC, RK, S, U, UI, V, lvl } from '../core/data.js'
import { agH, chart, hypH, igH, sensRows, mcCard } from '../ui/panels.js'
import { ALT, BP, D, TG, VX, VZ, tele } from '../core/world.js'
import { RT, STN } from '../scene/volcanoScene.js'
import { VOLCANOES, activeVolcano } from '../core/volcanoData.js'
import { backtestH, verificationPageHTML } from '../core/backtest.js'

/* ── Navigation definition ───────────────────────────────── */
export const NAV = [
  ['dash',         'Dashboard',       dashIco()],
  ['map',          'Live Map',        mapIco()],
  ['sensors',      'Sensors',         sensIco()],
  ['ai',           'AI Analysis',     aiIco()],
  ['verification', 'AI Verification', veriIco()],
  ['drone',        'Drone Missions',  droneIco()],
  ['alerts',       'Alerts',          alertIco()],
  ['reports',      'Reports',         repIco()],
  ['community',    'Community Alerts', sirenIco()],
  ['settings',     'Settings',        settIco()],
]

function veriIco() {
  return svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>')
}

/* ── SVG icon helpers ────────────────────────────────────── */
function svg(path, vb='0 0 24 24') {
  return `<svg class="ni-ic" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
}
function dashIco()  { return svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>') }
function mapIco()   { return svg('<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>') }
function sensIco()  { return svg('<path d="M2 12h4"/><path d="M18 12h4"/><path d="M12 2v4"/><path d="M12 18v4"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>') }
function aiIco()    { return svg('<circle cx="12" cy="12" r="3"/><path d="M3 12h1"/><path d="M12 3v1"/><path d="M20 12h1"/><path d="M12 20v1"/><path d="M5.64 5.64l.7.7"/><path d="M17.66 5.64l-.7.7"/><path d="M5.64 18.36l.7-.7"/><path d="M17.66 18.36l-.7-.7"/>') }
function droneIco() { return svg('<rect x="9" y="9" width="6" height="6" rx="1"/><path d="M3 3l4 4"/><path d="M21 3l-4 4"/><path d="M3 21l4-4"/><path d="M21 21l-4-4"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>') }
function alertIco() { return svg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>') }
function repIco()   { return svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>') }
function sirenIco() { return svg('<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 21h14"/><path d="M12 3v2"/><path d="M4.2 6.2l1.4 1.4"/><path d="M19.8 6.2l-1.4 1.4"/>') }
function settIco()  { return svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>') }

/* ── Auth Pages with 3D Canvas Background ─────────────────── */
export const authH = m => `<div class="auth">
  <div id="auth-3d-canvas" class="auth-3d-bg"></div>
  <div class="auth-left">
    <div class="brand">
      <span class="brand-icon">▲</span>
      VOLCANO <b>ZERO</b>
    </div>
    <div class="sub">AI-Powered Investigation &amp; Response</div>
    <div class="tagline">
      Smarter Decisions.
      <strong>Safer Communities.</strong>
    </div>
    <p class="desc">An agentic AI system to monitor volcanic activity, investigate uncertainties, and support rapid, data-driven response for emergency authorities.</p>
  </div>

  <div class="gl auth-panel">
    <h2>${m === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
    <p class="auth-sub">${m === 'login' ? 'Login to continue your mission' : 'Join VOLCANO ZERO'}</p>

    ${m === 'signup' ? `<div class="f"><label for="nm">Full Name</label><input id="nm" placeholder="Your full name" autocomplete="name"></div>` : ''}

    <div class="f">
      <label for="em">Email</label>
      <input id="em" type="email" placeholder="you@example.com" autocomplete="email">
    </div>

    <div class="f">
      <label for="pw">Password</label>
      <div class="pw-row">
        <input id="pw" type="password" placeholder="Enter password" autocomplete="${m === 'login' ? 'current' : 'new'}-password">
        <button class="pw-toggle" data-a="pw" type="button">Show</button>
      </div>
    </div>

    ${m === 'signup' ? `
      <div class="f">
        <label for="pw2">Confirm Password</label>
        <div class="pw-row">
          <input id="pw2" type="password" placeholder="Confirm password" autocomplete="new-password">
          <button class="pw-toggle" data-a="pw2" type="button">Show</button>
        </div>
      </div>
    ` : `
      <p style="text-align:right;margin:-4px 0 12px"><a href="#" data-a="forgot" style="font-size:12px;color:var(--cy)">Forgot password?</a></p>
    `}

    <div class="msg" id="msg" role="status"></div>

    <button class="btn pri" style="width:100%;justify-content:center;padding:12px;font-size:14px;border-radius:10px" data-a="${m}">
      ${m === 'login' ? 'Sign In' : 'Create Account'}
    </button>

    <div class="divider">or continue with</div>

    <div class="oauth-row">
      <button class="oauth-btn" data-oauth="google">
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button class="oauth-btn" data-oauth="github">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </button>
    </div>

    <p class="auth-footer">
      ${m === 'login' ? `No account? <a href="#/signup">Sign Up</a>` : `Have an account? <a href="#/login">Sign In</a>`}
    </p>
  </div>
</div>`

/* ── Landing Page ────────────────────────────────────────── */
export const LAND = `<div class="land">
  <div id="landing-3d-canvas" class="auth-3d-bg"></div>
  <nav class="nav">
    <span class="brand">
      <span class="brand-icon">▲</span>
      VOLCANO <b>ZERO</b>
    </span>
    <span class="sp"></span>
    <a href="#/">Home</a>
    <a href="#features">Features</a>
    <a href="#loop">How It Works</a>
    <a class="btn" href="#/login">Login</a>
    <a class="btn pri" href="#/signup">Sign Up</a>
  </nav>

  <div class="hero">
    <div class="hero-tag">AI Powered • Real-time • Multisensor</div>
    <h1>VOLCANO <b>ZERO</b></h1>
    <h2>Investigate • Understand • Respond</h2>
    <p>An agentic AI platform that monitors volcanic activity, resolves uncertain signals, coordinates evidence collection, and supports time-critical decisions.</p>
    <div class="hero-btns" style="align-items:center">
      <a class="btn pri" href="#/signup" style="font-size:14px;padding:12px 28px">Get Started</a>
      <a class="btn" href="#/app/dash" data-demo="1" style="font-size:14px;padding:12px 24px">▶ Watch Demo</a>
      <div class="floating-badge-landing">
        <span class="badge-icon">🛡️</span>
        <div>
          <b>Safer Communities</b>
          <small>Through Smarter AI →</small>
        </div>
      </div>
    </div>
  </div>

  <div id="loop" class="loop-section">
    <h3>The Agentic Investigation Pipeline</h3>
    <h2>Autonomous Decision-Making Under Uncertainty</h2>
    <div class="loop">
      ${[
        ['01','Observe','Continuous multi-sensor ingestion'],
        ['02','Detect','Anomaly trigger across seismic, thermal, gas'],
        ['03','Investigate','Active agent cross-verification'],
        ['04','Collect Evidence','Satellite, station & drone telemetry'],
        ['05','Reason','Hypothesis probability calculation'],
        ['06','Information Gain','Selection of highest uncertainty reduction'],
        ['07','Deploy Mission','Autonomous drone routing'],
        ['08','Collect New Data','Real-time aerial gas & thermal flux'],
        ['09','Update Hypothesis','Bayesian belief convergence'],
        ['10','Reassess Risk','Dynamic hazard zone calculation'],
        ['11','Recommend Action','Human-in-the-loop escalation']
      ].map(s => `<div class="loop-step"><b>${s[0]} · ${s[1]}</b><span>${s[2]}</span></div>`).join('')}
    </div>
  </div>
</div>`

/* ── Main Dashboard Template ──────────────────────────────── */
export const DASH = `<div>
  <div class="dash-greeting-bar">
    <div>
      <h2>Good Morning, ${U.name}</h2>
      <p>Here's the current status of the volcano and ongoing investigation.</p>
    </div>
    <div class="dash-datetime-badge">
      <span class="cal-ic">📅</span>
      <span id="dash-date">${new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
      <b id="dash-time">${V.CLK || '08:17 AM'}</b>
    </div>
  </div>

  <!-- 5 Sensor Metric Cards Strip -->
  <div id="mc-strip" class="mc-strip"></div>

  <!-- Real Location & Map Control Toolbar -->
  <div class="map-toolbar gl2">
    <div class="toolbar-loc">
      <span style="color:var(--cy);font-size:16px">📍</span>
      <div>
        <b id="active-volcano-title">${activeVolcano.name}</b>
        <small class="mu" id="active-volcano-sub">${activeVolcano.country} · ${activeVolcano.coords[0].toFixed(4)}° N, ${activeVolcano.coords[1].toFixed(4)}° E · Elev ${activeVolcano.elevation}m</small>
      </div>
    </div>

    <!-- Location Selector Dropdown -->
    <div class="loc-selector-wrap">
      <select id="volcano-select" class="volcano-dropdown" aria-label="Select Volcano">
        ${VOLCANOES.map(v => `<option value="${v.id}" ${v.id === activeVolcano.id ? 'selected' : ''}>${v.name} (${v.country})</option>`).join('')}
      </select>
    </div>

    <!-- My Location Button -->
    <button class="btn btn-cy" id="btn-my-loc" title="Center map on your GPS location">
      🎯 My Location
    </button>

    <div class="sp"></div>

    <!-- Map Mode Switcher: 2D Real Map / 3D Terrain -->
    <div class="map-mode-toggle">
      <button class="mode-btn ${V.mapMode === '2d' ? 'on' : ''}" id="btn-mode-2d" data-mode="2d">2D Real Map</button>
      <button class="mode-btn ${V.mapMode === '3d' ? 'on' : ''}" id="btn-mode-3d" data-mode="3d">3D Terrain</button>
    </div>

    <!-- Tile Switcher for 2D -->
    <div class="tile-layer-toggle" id="tile-layer-group" style="display:${V.mapMode === '2d' ? 'flex' : 'none'}">
      <button class="tile-btn on" id="btn-tile-sat" data-tile="satellite">Satellite</button>
      <button class="tile-btn" id="btn-tile-dark" data-tile="dark">Dark Map</button>
    </div>
  </div>

  <!-- Main Split Layout: Map Slot + Right Sidebar Cards -->
  <div class="dash">
    <div class="ms" id="mapslot"></div>
    <aside>
      <section class="gl p-sm" id="sensP" style="flex:1;min-height:0;overflow:auto"></section>
      <section class="gl p-sm" id="hyp"></section>
    </aside>
  </div>

  <!-- Bottom Strip: Timeline + Recommended Actions -->
  <div class="bot">
    <section class="gl p">
      <div class="tl-header">
        <h3>AI Investigation Timeline</h3>
        <span class="live-badge">LIVE</span>
      </div>
      <div id="tl"></div>
    </section>
    <section class="gl p">
      <h3>Recommended Actions</h3>
      <div id="act"></div>
    </section>
  </div>
</div>`

/* ── Tiles helper ─────────────────────────────────────────── */
export const tiles = a => `<div class="tiles">${a.map(x => `<div><small>${x[0]}</small><b style="color:${x[2]||'inherit'}">${x[1]}</b></div>`).join('')}</div>`

const PIL_FOR_LVL = ['sp-ok','sp-wa','sp-cr']

/* ── Detailed Views ───────────────────────────────────────── */
export const VIEWS = {

  community: () => '<div id="community-alerts-root"></div>',

  sensors: () => {
    const k = UI.sel, m = META[k], l = lvl(k)
    return `<div class="g2">
      <section class="gl p">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <h3 style="margin:0">Monitoring Network</h3>
          <small class="mu">${activeVolcano.name} Telemetry</small>
        </div>
        ${sensRows()}
      </section>
      <section class="gl p">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div>
            <h3>${m[1]}</h3>
            <div style="display:flex;align-items:baseline;gap:12px;margin-top:4px">
              <b style="font-size:38px;color:${CC[l]};line-height:1">${m[3](S.cur[k])}</b>
              <span class="status-pill ${PIL_FOR_LVL[l]}">${LV[l]}</span>
            </div>
          </div>
          <a class="btn btn-cy" href="#/app/sensor/${k}">Open Sensor Details →</a>
        </div>
        ${chart(S.h[k], CC[l])}
        ${tiles([['Monitoring Station',m[2]],['Last Reading',V.CLK],['Status',LV[l],CC[l]],['Data Stream','Calibrated Sensor']])}
      </section>
    </div>`
  },

  ai: () => `<div class="g3">
    <div style="display:grid;gap:14px">
      <section class="gl p">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:18px">🧠</span>
          <h3 style="margin:0">Current Situation Assessment</h3>
        </div>
        <p style="font-size:13px;line-height:1.65;color:var(--tx2)">${S.sit}</p>
        <h3 style="margin-top:16px">Multi-Source Sensor Evidence</h3>
        ${KEYS.map(k => `<div class="sr" style="cursor:default">
          <div class="sr-body"><div class="sr-label">${META[k][0]}</div></div>
          <b style="color:${CC[lvl(k)]}">${META[k][3](S.cur[k])}</b>
          <span class="status-pill ${PIL_FOR_LVL[lvl(k)]}" style="margin-left:8px">${LV[lvl(k)]}</span>
        </div>`).join('')}
      </section>
    </div>
    <div style="display:grid;gap:14px">
      <section class="gl p">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:18px">📊</span>
          <h3 style="margin:0">Active Hypotheses</h3>
        </div>
        ${hypH()}
      </section>
      <section class="gl p">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:18px">⚡</span>
          <h3 style="margin:0">Information Gain Utility</h3>
        </div>
        ${igH()}
      </section>
    </div>
    <div style="display:grid;gap:14px">
      <section class="gl p">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:18px">🤖</span>
          <h3 style="margin:0">AI Reasoning &amp; Strategy</h3>
        </div>
        <p style="font-size:13px;line-height:1.65;color:var(--tx2)">${S.why}</p>
        <h3 style="margin-top:16px">Next Best Action</h3>
        <div class="ac" style="background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.2)">
          <i>🎯</i><span>${S.next}</span>
        </div>
      </section>
      <section class="gl p">
        <div class="agp-title" style="margin-bottom:8px">AGENTIC SPECIALISTS STATUS</div>
        <div class="agp" style="position:static;width:auto;background:none;border:0;box-shadow:none;padding:0">
          ${agH()}
        </div>
      </section>
    </div>
  </div>
  ${backtestH()}`,

  drone: () => {
    const d = tele()
    const pr = !S.mn ? 0 : S.ms===0 ? 5 : S.ms===1 ? 5+55*D.fp : S.ms===2 ? 65 : S.ms===3 ? 70+30*D.fp : 100
    return `<div class="g2" style="grid-template-columns:1fr 310px">
      <section class="gl p">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <h4>${S.mn || 'No active drone deployment'}</h4>
            <div style="display:flex;gap:8px;margin-top:4px">
              <span class="status-pill sp-cy">${S.dst}</span>
              <span class="status-pill sp-ok">DRONE-01 · Hexacopter</span>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <a class="btn btn-cy" href="#/app/mission">Mission Details →</a>
          </div>
        </div>

        <svg viewBox="0 0 100 100" style="width:100%;max-height:420px;background:#060d1b;border-radius:14px;border:1px solid var(--gb3)">
          <circle cx="56" cy="46" r="40" fill="#0d1b11" opacity=".8"/>
          <circle cx="56" cy="46" r="40" fill="none" stroke="#38bdf8" stroke-opacity=".18" stroke-width=".4"/>
          <circle cx="${50+VX}" cy="${50+VZ}" r="14" fill="#f43f5e" fill-opacity=".15"/>
          <circle cx="${50+VX}" cy="${50+VZ}" r="5" fill="#f43f5e" fill-opacity=".35"/>
          <text x="${50+VX}" y="${50+VZ+16}" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="Inter">${activeVolcano.name}</text>
          <polyline points="${50+BP[0]},${50+BP[1]} ${50+TG[0]},${50+TG[1]}" stroke="${RT.alt?'#f43f5e':'#38e8ff'}" stroke-dasharray="2 1.5" fill="none" stroke-width=".8" style="display:${S.mn?'':'none'}"/>
          <polyline points="${ALT.map(p=>(50+p[0])+','+(50+p[1])).join(' ')}" stroke="#34d399" stroke-dasharray="2 1.5" fill="none" stroke-width=".8" style="display:${RT.alt?'':'none'}"/>
          <circle cx="${50+BP[0]}" cy="${50+BP[1]}" r="2.5" fill="#38bdf8"/>
          <text x="${50+BP[0]}" y="${50+BP[1]-4}" text-anchor="middle" fill="#38bdf8" font-size="3" font-family="Inter">Base</text>
          <circle cx="${50+TG[0]}" cy="${50+TG[1]}" r="2.8" fill="none" stroke="#fbbf24" stroke-width=".8"/>
          <text x="${50+TG[0]}" y="${50+TG[1]-4}" text-anchor="middle" fill="#fbbf24" font-size="3" font-family="Inter">Gas Zone A</text>
          <circle id="dd" cx="${50+D.x}" cy="${50+D.z}" r="2.5" fill="#fff"/>
        </svg>

        <div class="progbar" style="margin:14px 0"><i style="width:${pr}%"></i></div>
        ${tiles([['Mission Progress',Math.round(pr)+'%'],['Altitude AGL',d.alt+' m'],['Ground Speed',d.spd+' m/s'],['Battery Reserve',d.bat+'%',d.bat<30?'var(--wa)':'var(--ok)']])}
        ${tiles([['Radio Telemetry',d.sig],['Range to Target',d.dist+' m'],['Local Wind',S.wx],['Payload Sensor','SO₂ Laser Spectrometer']])}
      </section>

      <section class="gl p">
        <h3>Mission Phase Checklist</h3>
        ${S.mn ? MST.map((s,i) => `<div class="st ${i<S.ms?'d':i===S.ms?'a':''}"><i></i><span>${s}</span></div>`).join('') : '<p class="mu" style="font-size:12px">No mission active. Launch the scenario demo on the dashboard to deploy DRONE-01 autonomously.</p>'}
      </section>
    </div>`
  },

  alerts: () => {
    const f = { All:-1, High:2, Medium:1, Info:0 }
    const l = S.al.filter(a => f[UI.f]<0 || a.s===f[UI.f])
    const pilCol = [['#0e4a72','#38bdf8'],['#5c3900','#fbbf24'],['#6a1020','#f43f5e']]
    return `<section class="gl p">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <h3 style="margin:0">Real-Time Alerts &amp; Critical Notifications</h3>
          <small class="mu">Connected to active volcano monitoring feeds</small>
        </div>
        <span class="status-pill" style="background:rgba(${S.risk===0?'52,211,153':S.risk===1?'251,191,36':'244,63,94'},.15);color:var(--${S.risk===0?'ok':S.risk===1?'wa':'cr'})">Current Risk: ${RK[S.risk]}</span>
      </div>
      <div class="tab">${Object.keys(f).map(x=>`<button class="btn${x===UI.f?' on':''}" data-f="${x}">${x}</button>`).join('')}</div>
      ${l.length ? l.map(a => `<div class="al">
        <span class="mu">${a.t}</span>
        <span style="font-size:13px">${a.m}</span>
        <span class="pill" style="background:${pilCol[a.s][0]};color:${pilCol[a.s][1]}">${['Info','Medium','High'][a.s]}</span>
      </div>`).join('') : '<p class="mu" style="margin-top:12px;font-size:12px">No alerts currently logged.</p>'}
    </section>`
  },

  reports: () => `<div class="g3">
    ${[
      ['sit','Situation Report','Comprehensive volcanic activity assessment, risk classification, and multi-sensor status for civil defense authorities.'],
      ['mis','Mission Report','Aerial drone deployment flight log, collected SO₂ ppm concentration, telemetry performance, and trajectory data.'],
      ['sen','Sensor Report','Detailed telemetry analysis, minimum/maximum thresholds, calibration offsets, and trend summaries.']
    ].map(r => `<section class="gl p">
      <h3>${r[1]}</h3>
      <p class="mu" style="margin-bottom:14px;font-size:12px;line-height:1.5">${r[2]}</p>
      <button class="btn pri" style="width:100%;justify-content:center" data-rep="${r[0]}">Generate Report →</button>
    </section>`).join('')}
  </div>
  <section class="gl p" style="margin-top:14px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <h3>Report Preview (Emergency Command Format)</h3>
      <button class="btn" onclick="window.print()" style="font-size:12px">🖨️ Export PDF / Print</button>
    </div>
    <pre>${UI.rep || 'Select a report above to generate and format from the active monitoring state.'}</pre>
  </section>`,

  settings: () => `<div class="g2" style="grid-template-columns:300px 1fr">
    <section class="gl p">
      <h3>Operator Identity</h3>
      <div class="av" style="width:56px;height:56px;font-size:22px;border-radius:14px;margin-bottom:12px">${U.name[0]}</div>
      <h4>${U.name}</h4>
      <p class="mu" style="margin-top:4px;font-size:12px">${U.email}</p>
      <p class="mu" style="font-size:12px">Role: Emergency Monitoring Scientist</p>
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--gb3)">
        <button class="btn" id="btn-logout" style="width:100%;justify-content:center;color:var(--cr);border-color:rgba(244,63,94,.3)">Log Out</button>
      </div>
    </section>
    <section class="gl p">
      <h3>System Configuration &amp; Visual Preferences</h3>
      ${[['rm','Reduce Motion &amp; Transitions',O.rm],['smoke','Volcanic Smoke Particle Engine',O.smoke],['lab','3D Spatial Annotations &amp; Labels',O.lab]].map(t => `<div class="tg">
        <div><h4 style="font-size:13px">${t[1]}</h4></div>
        <button class="btn ${t[2]?'btn-ok':''}" data-tg="${t[0]}" role="switch" aria-checked="${!!t[2]}">${t[2]?'On':'Off'}</button>
      </div>`).join('')}
      <div class="tg">
        <div><h4 style="font-size:13px">Simulation Scenario Pace</h4><p class="mu" style="font-size:11px">Speed up or slow down automated demo transitions</p></div>
        <button class="btn btn-cy" data-tg="sp">${O.sp}×</button>
      </div>
    </section>
  </div>`,

  verification: () => verificationPageHTML()
}

/* ── Profile View ─────────────────────────────────────────── */
VIEWS.profile = () => `<div class="g2" style="grid-template-columns:320px 1fr">
  <section class="gl p">
    <div class="av" style="width:68px;height:68px;font-size:26px;border-radius:16px;margin-bottom:14px">${U.name[0]}</div>
    <h4 style="font-size:18px">${U.name}</h4>
    <p class="mu" style="margin-top:4px">${U.email}</p>
    <p class="mu" style="font-size:12px">Role: Senior Duty Scientist · Emergency Intelligence</p>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--gb3);display:flex;flex-direction:column;gap:6px">
      <a class="ni on" href="#/app/profile">👤 My Profile</a>
      <a class="ni" href="#/app/settings">⚙ Settings</a>
      <a class="ni" href="#/app/alerts">🔔 Notifications</a>
      <button class="ni" id="btn-logout-2" style="background:none;border:none;color:var(--cr);cursor:pointer;text-align:left;width:100%">⎋ Logout</button>
    </div>
  </section>
  <section class="gl p">
    <h3>Active Session Summary</h3>
    ${tiles([['Monitoring Station',activeVolcano.name],['Risk Classification',RK[S.risk],RC[S.risk]],['Alerts Triggered',S.al.length],['Active Missions',S.mn?S.dst:'None']])}
  </section>
</div>`

/* ── Back button helper ───────────────────────────────────── */
export const back = h => `<a class="btn" href="${h}" style="float:right">← Back</a>`

/* ── Sensor Detail Page ───────────────────────────────────── */
VIEWS.sensor = () => {
  const k = UI.sel, m = META[k], l = lvl(k), a = S.h[k]
  return `<section class="gl p">
    ${back('#/app/sensors')}
    <h3>Sensor Details</h3>
    <div class="tab">${KEYS.map(x=>`<a class="btn${x===k?' on':''}" href="#/app/sensor/${x}">${META[x][0]}</a>`).join('')}</div>
    <p class="mu" style="margin-bottom:10px">${m[1]} · ${activeVolcano.name}</p>
    <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:12px">
      <b style="font-size:44px;line-height:1;color:${CC[l]}">${m[3](S.cur[k])}</b>
      <span class="status-pill ${PIL_FOR_LVL[l]}">${LV[l]}</span>
    </div>
    ${chart(a, CC[l])}
    ${tiles([['Installation Location',m[2]],['Last Synchronized',V.CLK],['Node Status',LV[l],CC[l]],['Sensor Feed','Calibrated Digital Output']])}
  </section>`
}

/* ── Mission Detail Page ──────────────────────────────────── */
VIEWS.mission = () => {
  const d = tele()
  return `<section class="gl p">
    ${back('#/app/drone')}
    <h3>Drone Mission — ${S.mn || 'Gas Monitoring (Zone A)'}</h3>
    ${S.mn ? `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <span style="font-size:16px;font-weight:600">${S.mn}</span>
        <span class="status-pill sp-cy">${S.dst}</span>
      </div>
      ${tiles([['Aircraft ID','DRONE-01'],['Battery Reserve',d.bat+'%',d.bat<30?'var(--wa)':'var(--ok)'],['Altitude AGL',d.alt+' m'],['Link Quality',d.sig]])}
      <h3 style="margin-top:18px">Mission Steps Progress</h3>
      ${MST.map((t,i) => `<div class="st ${i<S.ms?'d':i===S.ms?'a':''}"><i></i><span>${t}</span></div>`).join('')}
    ` : '<p class="mu" style="font-size:12px">No mission active. Launch the volcano investigation scenario to trigger DRONE-01 launch.</p>'}
  </section>`
}

/* ── Report Generation Logic ──────────────────────────────── */
export const REP = {
  sit: () => [
    '================================================================',
    `EMERGENCY SITUATION REPORT · ${activeVolcano.name.toUpperCase()}, ${activeVolcano.country.toUpperCase()}`,
    `ISSUED: ${new Date().toISOString()} · RISK CLASSIFICATION: ${RK[S.risk]}`,
    '================================================================',
    `Weather Condition: ${S.wx}`,
    ...KEYS.map(k => `${META[k][0]}: ${META[k][3](S.cur[k])} (${LV[lvl(k)]})`),
    '',
    'AI SITUATION SUMMARY:',
    S.sit,
    '',
    'REASONING & EVIDENCE CONVERGENCE:',
    S.why,
    '',
    `Dominant Hypothesis: ${HYN[S.hy.indexOf(Math.max(...S.hy))]} (${Math.max(...S.hy)}% confidence)`,
    `Recommended Operational Action: ${S.next}`,
    '================================================================'
  ].join('\n'),

  mis: () => S.mn ? [
    '================================================================',
    `AERIAL DRONE MISSION REPORT · ${activeVolcano.name.toUpperCase()}`,
    `MISSION IDENTIFIER: ${S.mn}`,
    '================================================================',
    `Status: ${S.dst}`,
    `Battery Remaining: ${tele().bat}%`,
    `Steps Completed: ${Math.min(S.ms,4)} / 4`,
    '',
    'MISSION LOG:',
    ...S.tl.filter(e => /drone|route|wind|gas/i.test(e.m)).map(e => `  [${e.t}] ${e.m}`),
    '================================================================'
  ].join('\n') : 'No drone mission has been executed yet.',

  sen: () => [
    '================================================================',
    `SENSOR NETWORK AUDIT REPORT · ${activeVolcano.name.toUpperCase()}`,
    '================================================================',
    ...KEYS.map(k => `${META[k][2]} (${META[k][0]}): Current = ${META[k][3](S.cur[k])}, Min = ${META[k][3](Math.min(...S.h[k]))}, Max = ${META[k][3](Math.max(...S.h[k]))}`),
    '================================================================'
  ].join('\n')
}
