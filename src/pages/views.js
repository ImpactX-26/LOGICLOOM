import { CC, HYN, KEYS, LV, META, MST, O, RC, RK, S, U, UI, V, lvl } from '../core/data.js'
import {
  topSensorCards,
  islandMapCard,
  latestAlertCard,
  currentHypothesesCard,
  nextRecommendedActionCard,
  sensorTrendsSection,
  chart,
  renderSmoothSparkline
} from '../ui/panels.js'
import { tele } from '../core/world.js'

/* ── Exact Left Navigation (matching image) ─────────────────── */
export const NAV = [
  ['dash',        'Dashboard',          dashSvg()],
  ['sensors',     'Sensors',            sensSvg()],
  ['log',         'Investigation Log',  logSvg()],
  ['hypotheses',  'Hypotheses',         hypoSvg()],
  ['missions',    'Mission Planning',   droneSvg()],
  ['reports',     'Reports',            repSvg()],
  ['settings',    'Settings',           settSvg()],
]

/* ── SVG Icons ────────────────────────────────────────────── */
function svg(p, vb = '0 0 24 24') {
  return `<svg class="nav-ic-svg" viewBox="${vb}" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
}
function dashSvg()  { return svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>') }
function sensSvg()  { return svg('<path d="M4.93 4.93a10 10 0 0 1 14.14 0"/><path d="M7.76 7.76a6 6 0 0 1 8.48 0"/><circle cx="12" cy="12" r="2.5"/>') }
function logSvg()   { return svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>') }
function hypoSvg()  { return svg('<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>') }
function droneSvg() { return svg('<rect x="9" y="9" width="6" height="6" rx="1"/><path d="M3 3l4 4"/><path d="M21 3l-4 4"/><path d="M3 21l4-4"/><path d="M21 21l-4-4"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>') }
function repSvg()   { return svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="8" y1="18" x2="8" y2="15"/><line x1="16" y1="18" x2="16" y2="9"/>') }
function settSvg()  { return svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>') }

/* ── Mountain Watermark Silhouette SVG (Sidebar footer) ───── */
export const MOUNTAIN_LOGO_SVG = `
<svg viewBox="0 0 40 24" width="34" height="20" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.6" stroke-linejoin="round">
  <path d="M2 22 L14 4 L22 16 L28 10 L38 22 Z"/>
  <path d="M10 18 L14 12 L18 18" stroke="rgba(56,189,248,0.5)"/>
</svg>
`

/* ── EXACT MAIN DASHBOARD VIEW (Matching screenshot) ─────── */
export const DASH = `
<div class="dash-view-wrapper">
  <!-- Top Greeting & Date/Time Row -->
  <div class="main-greeting-row">
    <div class="greeting-left">
      <h1 class="greeting-headline">Good Morning, Shilpa</h1>
      <p class="greeting-subtext">Here's the current status of the volcano and ongoing investigation.</p>
    </div>
    <div class="greeting-right-datetime">
      <div class="datetime-calendar-line">
        <span class="datetime-cal-ic">📅</span>
        <span class="datetime-date-text">Thu, 09 Oct 2026</span>
      </div>
      <div class="datetime-clock-text" id="dash-live-clock">11:24 AM</div>
    </div>
  </div>

  <!-- 5 Sensor Status Cards Row -->
  <div class="top-sensors-grid" id="top-sensors-grid-slot">
    <!-- Populated by fillDash() -->
  </div>

  <!-- Middle Row: Island Map (70%) + Action Cards (30%) -->
  <div class="middle-split-row">
    <div class="map-column-left" id="island-map-slot">
      <!-- Populated by islandMapCard() -->
    </div>
    <div class="cards-column-right">
      <div id="latest-alert-card-slot"></div>
      <div id="hypotheses-card-slot"></div>
      <div id="next-action-card-slot"></div>
    </div>
  </div>

  <!-- Bottom Row: Sensor Trends (Last 6 Hours) -->
  <div class="sensor-trends-wrapper" id="sensor-trends-row-slot">
    <!-- Populated by sensorTrendsSection() -->
  </div>
</div>
`

/* ── Auth View ────────────────────────────────────────────── */
export const authH = m => `
<div class="auth">
  <div id="auth-3d-canvas" class="auth-3d-bg"></div>
  <div class="auth-left">
    <div class="brand">
      <span class="brand-volcano-icon">▲</span>
      VOLCANO <b style="color:#ff5247">ZERO</b>
    </div>
    <div class="sub">AI-Powered Investigation &amp; Response</div>
    <div class="tagline">
      Smarter Decisions.
      <strong>Safer Communities.</strong>
    </div>
    <p class="desc">Agentic AI system to monitor volcanic activity, investigate uncertainties, and support rapid, data-driven response.</p>
  </div>

  <div class="gl auth-panel">
    <h2>${m === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
    <p class="auth-sub">${m === 'login' ? 'Login to continue your mission' : 'Join VOLCANO ZERO'}</p>

    ${m === 'signup' ? `<div class="f"><label for="nm">Full Name</label><input id="nm" placeholder="Enter your name" autocomplete="name"></div>` : ''}

    <div class="f">
      <label for="em">Email</label>
      <input id="em" type="email" placeholder="you@example.com" autocomplete="email">
    </div>

    <div class="f">
      <label for="pw">Password</label>
      <div class="pw-row">
        <input id="pw" type="password" placeholder="Enter password" autocomplete="${m === 'login' ? 'current' : 'new'}-password">
        <button class="pw-toggle" data-a="pw" type="button">👁</button>
      </div>
    </div>

    ${m === 'signup' ? `
      <div class="f">
        <label for="pw2">Confirm Password</label>
        <div class="pw-row">
          <input id="pw2" type="password" placeholder="Confirm password" autocomplete="new-password">
          <button class="pw-toggle" data-a="pw2" type="button">👁</button>
        </div>
      </div>
    ` : `
      <p style="text-align:right;margin:-4px 0 12px"><a href="#" data-a="forgot" style="font-size:12px;color:var(--cy)">Forgot?</a></p>
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
      ${m === 'login' ? `Don't have an account? <a href="#/signup">Sign Up</a>` : `Already have an account? <a href="#/login">Sign In</a>`}
    </p>
  </div>
</div>
`

/* ── Landing View ─────────────────────────────────────────── */
export const LAND = `
<div class="land">
  <div id="landing-3d-canvas" class="auth-3d-bg"></div>
  <nav class="nav">
    <span class="brand">
      <span class="brand-volcano-icon">▲</span>
      VOLCANO <b style="color:#ff5247">ZERO</b>
    </span>
    <span class="sp"></span>
    <a href="#/">Home</a>
    <a href="#features">Features</a>
    <a href="#technology">Technology</a>
    <a class="btn" href="#/login">Login</a>
    <a class="btn pri" href="#/signup">Sign Up</a>
  </nav>

  <div class="hero">
    <div class="hero-tag">AI Powered • Real-time • Multisensor</div>
    <h1>VOLCANO <b style="color:#ff5247">ZERO</b></h1>
    <h2>Investigate • Understand • Respond</h2>
    <p>An agentic AI platform that monitors volcanic activity, resolves uncertain signals, coordinates data collection, and supports timely, safe decision-making.</p>
    <div class="hero-btns" style="align-items:center">
      <a class="btn pri" href="#/signup" style="font-size:14px;padding:12px 28px">Get Started</a>
      <a class="btn" href="#/app/dash" data-demo="1" style="font-size:14px;padding:12px 24px">▶ Watch Demo</a>
    </div>
  </div>
</div>
`

/* ── Supporting View Pages ────────────────────────────────── */
export const VIEWS = {
  sensors: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>Sensors Telemetry Network</h2>
          <p class="mu">Ground, Atmospheric, and Optical Observation Matrix</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div class="top-sensors-grid" style="margin-bottom:24px">
        ${topSensorCards()}
      </div>
      <div class="sensor-trends-wrapper">
        ${sensorTrendsSection()}
      </div>
    </div>
  `,

  log: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>AI Investigation Log</h2>
          <p class="mu">Chronological Decision Stream &amp; Information Gain Reasoning</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div class="gl p">
        ${S.tl.map(e => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
            <span style="font-size:11px;color:var(--cy);font-family:monospace;width:60px">${e.t}</span>
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${e.s===2?'#f43f5e':e.s===1?'#f59e0b':'#10b981'}"></span>
            <span style="font-size:13px;flex:1">${e.m}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `,

  hypotheses: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>Probabilistic Hypotheses Distribution</h2>
          <p class="mu">Bayesian Evidence Convergence Engine</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div style="max-width:600px">
        ${currentHypothesesCard()}
      </div>
    </div>
  `,

  missions: () => {
    const d = tele()
    return `
      <div style="padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div>
            <h2>Autonomous Mission Planning</h2>
            <p class="mu">UAV Deployment &amp; Targeted Volcanic Gas Interception</p>
          </div>
          <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 340px;gap:20px">
          <div class="gl p">
            <h3>Active Sortie: Gas Monitoring (Zone A)</h3>
            <p class="mu" style="margin-bottom:14px">Target: Crater flank SO₂ concentration plume mapping.</p>
            <div style="height:320px;border-radius:12px;overflow:hidden;margin-bottom:16px">
              <img src="/volcano-island.jpg" style="width:100%;height:100%;object-fit:cover" />
            </div>
            <div style="display:flex;gap:12px">
              <button class="btn pri" id="btn-demo-drone" onclick="alert('Autonomous drone re-tasking initiated.')">Deploy UAV Now</button>
              <button class="btn" style="color:var(--cr)" onclick="alert('Mission aborted.')">Abort Mission</button>
            </div>
          </div>
          <div>
            ${nextRecommendedActionCard()}
          </div>
        </div>
      </div>
    `
  },

  reports: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>Executive Intelligence Reports</h2>
          <p class="mu">National Emergency &amp; Scientific Observatory Synthesis</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div class="gl p">
        <pre style="background:none;border:none;padding:0;color:#e2e8f0;font-size:13px;line-height:1.6">
================================================================
VOLCANO ZERO · SITUATION REPORT (ISLAND A)
DATE: 09 OCT 2026 11:24 AM · CLASSIFICATION: ELEVATED ALERT
================================================================
• Seismic Activity: HIGH (+42% continuous tremor detected)
• Thermal Flux: NORMAL (crater dome surface temp baseline 34°C)
• Gas Emissions: ELEVATED (SO₂: 312 ppm at South Station)
• Visual Optical: Smoke plume detected on crater summit webcam
• Dominant AI Hypothesis: Volcanic Instability (55% confidence)
• Recommended Action: Deploy aerial drone for localized gas sampling.
================================================================
        </pre>
        <button class="btn pri" onclick="window.print()" style="margin-top:16px">Print / Export PDF</button>
      </div>
    </div>
  `,

  settings: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>System &amp; Station Settings</h2>
          <p class="mu">Operator Configuration &amp; Telemetry Stream Feeds</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div class="gl p" style="max-width:540px">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
          <div style="width:48px;height:48px;border-radius:50%;background:#1d4ed8;display:grid;place-items:center;font-size:18px;font-weight:700">SP</div>
          <div>
            <h4 style="font-size:16px">Shilpa P</h4>
            <p class="mu">Senior Volcanologist · Duty Officer</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <label style="display:flex;justify-content:space-between;align-items:center">
            <span>Audio Emergency Alarms</span>
            <input type="checkbox" checked />
          </label>
          <label style="display:flex;justify-content:space-between;align-items:center">
            <span>Auto-Deploy Drone on High Certainty</span>
            <input type="checkbox" checked />
          </label>
          <label style="display:flex;justify-content:space-between;align-items:center">
            <span>Satellite Stream Fallback</span>
            <input type="checkbox" checked />
          </label>
        </div>
        <button class="btn" id="btn-logout" style="margin-top:24px;color:var(--cr);border-color:rgba(244,63,94,0.3)">Log Out</button>
      </div>
    </div>
  `,

  alerts: () => `
    <div style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <h2>Alerts &amp; Incidents</h2>
          <p class="mu">Real-time Emergency Notification Stream</p>
        </div>
        <button class="btn btn-cy" onclick="location.hash='#/app/dash'">← Back to Dashboard</button>
      </div>
      <div style="max-width:680px">
        ${latestAlertCard()}
        <div style="margin-top:16px" class="gl p">
          ${S.al.map(a => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
              <div>
                <b>${a.m}</b>
                <div class="mu" style="font-size:11px">${a.t}</div>
              </div>
              <span class="status-pill ${a.s===2?'sp-cr':a.s===1?'sp-wa':'sp-ok'}">${a.s===2?'CRITICAL':a.s===1?'WARNING':'INFO'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `,

  profile: () => `
    <div style="padding:16px">
      <button class="btn btn-cy" onclick="location.hash='#/app/dash'" style="margin-bottom:16px">← Back to Dashboard</button>
      <div class="gl p" style="max-width:500px">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div style="width:56px;height:56px;border-radius:50%;background:#1d4ed8;display:grid;place-items:center;font-size:22px;font-weight:700">SP</div>
          <div>
            <h3>Shilpa P</h3>
            <p class="mu">shilpa@volcanozero.ai</p>
          </div>
        </div>
        <p class="mu">Clearance Level: Tier 1 National Emergency Response Operator</p>
        <button class="btn" id="btn-logout" style="margin-top:20px;color:var(--cr)">Log Out</button>
      </div>
    </div>
  `
}

export const REP = { sit: () => '', mis: () => '', sen: () => '' }
