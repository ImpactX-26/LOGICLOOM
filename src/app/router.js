import { DASH, LAND, NAV, REP, VIEWS, authH } from '../pages/views.js'
import { $, KEYS, META, NZ, O, RC, RK, S, U, UI, V, hooks } from '../core/data.js'
import { STN, boot3D, mapEl } from '../scene/volcanoScene.js'
import { initRealMap, setMapTileLayer, flyToVolcano, flyToUserLocation } from '../scene/realMap.js'
import { initAuth3D } from '../scene/authScene.js'
import { initAuth, signInEmail, signUpEmail, triggerOAuth, clearSession } from '../core/auth.js'
import { fillDash, ui } from '../ui/panels.js'
import { run } from '../core/sim.js'
import { G, G0, VX, VZ, cam } from '../core/world.js'
import { VOLCANOES, activeVolcano } from '../core/volcanoData.js'
import { backtestState } from '../core/backtest.js'

export let root, started = 0
let auth3dCleanup = null
let realMapDiv = null

export function shell(inner) {
  const page = V.page || 'dash'
  const activePage = { sensor: 'sensors', mission: 'drone' }[page] || page

  return `<div class="app">
    <nav class="sb gl">
      <div class="sb-brand">
        <a class="brand" href="#/">
          <span class="brand-icon">▲</span>
          VOLCANO <b>ZERO</b>
        </a>
      </div>
      <div class="sb-section">OPERATIONAL VIEWS</div>
      ${NAV.map(n => `<a class="ni${n[0] === activePage ? ' on' : ''}" href="#/app/${n[0]}">
        ${n[2]}<span>${n[1]}</span>
      </a>`).join('')}
      <div class="sb-footer">
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--cy)">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ok)"></span>
          Agentic AI Pipeline Active
        </div>
        <p style="margin-top:4px">Autonomous Investigation Under Uncertainty</p>
      </div>
    </nav>
    <main>
      <header class="top">
        <input id="sq" class="sq" placeholder="Search country, volcano, station or page…" aria-label="Search">
        <span class="sp"></span>
        <div class="sys-pill" id="sysc">
          <span class="sys-dot ${S.risk === 0 ? 'ok' : S.risk === 1 ? 'wa' : 'cr'}" id="sysd"></span>
          <span id="systxt">${S.run ? 'Scenario Active' : S.risk === 0 ? 'System Online' : RK[S.risk]}</span>
        </div>
        <button class="bell-btn" aria-label="Alerts" onclick="location.hash='#/app/alerts'" title="Notifications">
          🔔<sup id="bell"></sup>
        </button>
        <div class="tm">
          <b id="clk">${V.CLK || '08:17 AM'}</b>
          <small id="dt">${new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</small>
        </div>
        <a class="av" href="#/app/profile" title="${U.name} · My Profile">${(U.name || 'O')[0]}</a>
      </header>
      <div id="view">${inner}</div>
    </main>
  </div>`
}

export function render() {
  const h = location.hash.slice(2).split('/')
  const a = h[0]

  // Cleanup prior 3D auth background if leaving auth/landing
  if (auth3dCleanup) {
    auth3dCleanup()
    auth3dCleanup = null
  }

  // Direct route for #/verification
  if (a === 'verification') {
    location.hash = '#/app/verification'
    return
  }

  if (a === 'app') {
    V.page = NAV.some(n => n[0] === h[1]) || ['profile','sensor','mission','verification'].includes(h[1]) ? h[1] : 'dash'
    if (V.page === 'sensor' && META[h[2]]) UI.sel = h[2]

    root.innerHTML = shell(
      V.page === 'dash' ? DASH :
      V.page === 'map' ? '<div class="ms big" id="mapslot"></div>' :
      VIEWS[V.page]()
    )

    if (V.page === 'dash' || V.page === 'map') {
      mountMap()
    }
    if (V.page === 'dash') fillDash()
    tick2()
  } else if (a === 'login' || a === 'signup') {
    root.innerHTML = authH(a)
    const bgContainer = document.getElementById('auth-3d-canvas')
    if (bgContainer) {
      auth3dCleanup = initAuth3D(bgContainer)
    }
  } else {
    root.innerHTML = LAND
    const bgContainer = document.getElementById('landing-3d-canvas')
    if (bgContainer) {
      auth3dCleanup = initAuth3D(bgContainer)
    }
  }
  scrollTo(0, 0)
}

function mountMap() {
  const slot = $('#mapslot')
  if (!slot) return
  slot.innerHTML = ''

  if (V.mapMode === '2d') {
    if (!realMapDiv) {
      realMapDiv = document.createElement('div')
      realMapDiv.id = 'real-map'
      realMapDiv.style.width = '100%'
      realMapDiv.style.height = '100%'
      realMapDiv.style.borderRadius = '16px'
    }
    slot.appendChild(realMapDiv)
    initRealMap(realMapDiv)
  } else {
    slot.appendChild(mapEl)
    boot3D()
    ui()
  }
}

export function refresh() {
  if (V.page === 'dash') {
    fillDash()
    const titleEl = document.getElementById('active-volcano-title')
    const subEl = document.getElementById('active-volcano-sub')
    if (titleEl) titleEl.textContent = activeVolcano.name
    if (subEl) subEl.textContent = `${activeVolcano.country} · ${activeVolcano.coords[0].toFixed(4)}° N, ${activeVolcano.coords[1].toFixed(4)}° E · Elev ${activeVolcano.elevation}m`
  } else if (VIEWS[V.page] && V.page !== 'reports' && V.page !== 'settings' && V.page !== 'profile' && location.hash.startsWith('#/app')) {
    const vEl = document.getElementById('view')
    if (vEl) vEl.innerHTML = VIEWS[V.page]()
  }
  ui()
  tick2()
}

export function tick2() {
  const c = $('#clk')
  if (c) c.textContent = V.CLK
  const dt = $('#dt')
  if (dt) dt.textContent = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })

  const alertCount = S.al.filter(a => a.s === 2).length
  const bell = $('#bell')
  if (bell) bell.textContent = alertCount || ''

  const d = document.getElementById('sysd')
  const t = document.getElementById('systxt')
  if (d && t) {
    d.className = `sys-dot ${S.risk === 0 ? 'ok' : S.risk === 1 ? 'wa' : 'cr'}`
    t.textContent = S.run ? 'Scenario Active' : S.risk === 0 ? 'System Online' : RK[S.risk]
  }

  const dashTime = document.getElementById('dash-time')
  if (dashTime) dashTime.textContent = V.CLK
}

// Live simulation clock tick
setInterval(() => {
  V.CLK = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  for (const k of KEYS) {
    S.cur[k] += (S.tg[k] - S.cur[k]) * 0.6 + (Math.random() - 0.5) * NZ[k]
    S.h[k].push(S.cur[k])
    S.h[k].shift()
  }
  if (location.hash.startsWith('#/app')) refresh()
}, 1500)

V.CLK = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// Form Authentication submit handler
export async function authGo(m) {
  const emInput = $('#em')
  const pwInput = $('#pw')
  const msg = $('#msg')
  const bad = t => { msg.className = 'msg er'; msg.textContent = t }

  if (!emInput || !pwInput) return
  const em = emInput.value.trim()
  const pw = pwInput.value

  if (m === 'signup' && !$('#nm').value.trim()) return bad('Please enter your full name.')
  if (!/^\S+@\S+\.\S+$/.test(em)) return bad('Please enter a valid email address.')
  if (pw.length < 6) return bad('Password must be at least 6 characters.')
  if (m === 'signup' && pw !== $('#pw2').value) return bad('Passwords do not match.')

  msg.className = 'msg info'
  msg.innerHTML = '<span class="spn"></span> Authenticating credentials…'

  try {
    if (m === 'signup') {
      await signUpEmail($('#nm').value.trim(), em, pw)
    } else {
      await signInEmail(em, pw)
    }
    msg.className = 'msg ok'
    msg.textContent = '✓ Authentication successful. Entering command center…'
    setTimeout(() => {
      location.hash = '#/app/dash'
    }, 600)
  } catch (err) {
    bad(err.message || 'Authentication failed. Please verify credentials.')
  }
}

// Global click delegation
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-c],[data-k],[data-f],[data-rep],[data-tg],[data-a],[data-st],[data-demo],[data-oauth],[data-mode],[data-tile],[data-bkt-ds],[data-bkt-row],[data-action],#go,#btn-my-loc,#btn-logout,#btn-logout-2')
  if (!t) return
  const d = t.dataset

  // Run historical verification demo button
  if (d.action === 'run-verification') {
    backtestState.isVerifying = true
    refresh()
    setTimeout(() => {
      backtestState.isVerifying = false
      backtestState.verificationRan = true
      refresh()
    }, 550)
    return
  }

  // Toggle raw CSV inspection view
  if (d.action === 'toggle-raw-csv') {
    backtestState.showRawCSV = !backtestState.showRawCSV
    refresh()
    return
  }

  // Backtest dataset switch
  if (d.bktDs) {
    backtestState.activeDatasetKey = d.bktDs
    backtestState.selectedRowIndex = 6
    refresh()
    return
  }

  // Backtest row inspection select
  if (d.bktRow !== undefined) {
    backtestState.selectedRowIndex = parseInt(d.bktRow, 10)
    refresh()
    return
  }

  // Start demo scenario
  if (t.id === 'go') return run()
  if (d.demo) {
    location.hash = '#/app/dash'
    setTimeout(run, 1500)
    return
  }

  // Logout
  if (t.id === 'btn-logout' || t.id === 'btn-logout-2') {
    clearSession()
    location.hash = '#/'
    return
  }

  // Map 2D / 3D mode switch
  if (d.mode) {
    V.mapMode = d.mode
    const b2d = document.getElementById('btn-mode-2d')
    const b3d = document.getElementById('btn-mode-3d')
    const tileGrp = document.getElementById('tile-layer-group')
    if (b2d && b3d) {
      b2d.classList.toggle('on', d.mode === '2d')
      b3d.classList.toggle('on', d.mode === '3d')
    }
    if (tileGrp) tileGrp.style.display = d.mode === '2d' ? 'flex' : 'none'
    mountMap()
    return
  }

  // Map tile switch (Satellite / Dark)
  if (d.tile) {
    setMapTileLayer(d.tile)
    const bSat = document.getElementById('btn-tile-sat')
    const bDark = document.getElementById('btn-tile-dark')
    if (bSat && bDark) {
      bSat.classList.toggle('on', d.tile === 'satellite')
      bDark.classList.toggle('on', d.tile === 'dark')
    }
    return
  }

  // "My Location" GPS Button
  if (t.id === 'btn-my-loc') {
    const btn = t
    const orig = btn.innerHTML
    btn.innerHTML = '<span class="spn"></span> Locating…'
    flyToUserLocation(
      (coords) => {
        btn.innerHTML = '✓ Found GPS'
        setTimeout(() => btn.innerHTML = orig, 2500)
      },
      (errMsg) => {
        btn.innerHTML = '⚠️ Denied'
        alert(errMsg)
        setTimeout(() => btn.innerHTML = orig, 2500)
      }
    )
    return
  }

  // OAuth triggers (Google / GitHub)
  if (d.oauth) {
    const msg = $('#msg')
    if (msg) {
      msg.className = 'msg info'
      msg.innerHTML = `<span class="spn"></span> Connecting to ${d.oauth.toUpperCase()} OAuth provider…`
    }
    try {
      await triggerOAuth(d.oauth)
    } catch (err) {
      if (msg) {
        msg.className = 'msg er'
        msg.textContent = err.message
      }
    }
    return
  }

  // Sensors & Navigation
  if (d.k) {
    UI.sel = d.k
    if (V.page === 'dash') location.hash = '#/app/sensors'
    else refresh()
    return
  }
  if (d.f) { UI.f = d.f; return refresh() }
  if (d.rep) {
    UI.rep = REP[d.rep]()
    const vEl = document.getElementById('view')
    if (vEl) vEl.innerHTML = VIEWS.reports()
    return
  }
  if (d.tg) {
    if (d.tg === 'sp') O.sp = O.sp === 1 ? 2 : O.sp === 2 ? 0.5 : 1
    else O[d.tg] = O[d.tg] ? 0 : 1
    document.body.classList.toggle('rm', !!O.rm)
    const vEl = document.getElementById('view')
    if (vEl) vEl.innerHTML = VIEWS[V.page]()
    return
  }

  // Password visibility toggle
  if (d.a === 'pw' || d.a === 'pw2') {
    const i = $(d.a === 'pw2' ? '#pw2' : '#pw')
    if (i) {
      i.type = i.type === 'password' ? 'text' : 'password'
      t.textContent = i.type === 'password' ? 'Show' : 'Hide'
    }
    return
  }

  if (d.st) { V.SEL = { t: 'st', id: d.st }; return }
  if (d.a) return authGo(d.a)

  // 3D Controls
  if (d.c === 'x') { V.SEL = null; return ui() }
  if (d.c === '2d') G.ph = 0.02
  if (d.c === '3d') G.ph = 1
  if (d.c === 'in') G.d = Math.max(22, G.d * 0.8)
  if (d.c === 'out') G.d = Math.min(220, G.d * 1.25)
  if (d.c === 'rs') cam(G0)
  if (d.c === 'cl') G.d > 60 ? cam({ tx: VX, tz: VZ, ty: 16, d: 40, ph: 0.95 }) : cam(G0)
})

// Volcano selector dropdown change handler
document.addEventListener('change', e => {
  if (e.target.id === 'volcano-select') {
    const selectedId = e.target.value
    flyToVolcano(selectedId)
    refresh()
  }
})

// Search input keydown handler
document.addEventListener('keydown', e => {
  if (e.target.id !== 'sq' || e.key !== 'Enter') return
  const q = e.target.value.toLowerCase().trim()
  if (!q) return

  // Search real volcano
  const matchedVolcano = VOLCANOES.find(v => v.name.toLowerCase().includes(q) || v.country.toLowerCase().includes(q) || v.id.includes(q))
  if (matchedVolcano) {
    flyToVolcano(matchedVolcano.id)
    if (V.page !== 'dash' && V.page !== 'map') location.hash = '#/app/dash'
    refresh()
    return
  }

  // Search stations
  const matchedStation = STN.find(s => s.n.toLowerCase().includes(q))
  if (matchedStation) {
    V.SEL = { t: 'st', id: matchedStation.id }
    location.hash = '#/app/dash'
    return
  }

  // Search pages
  const n = NAV.find(n => n[1].toLowerCase().includes(q))
  if (n) location.hash = '#/app/' + n[0]
})

hooks.refresh = refresh

export async function start() {
  if (started) return
  started = 1
  root = $('#root')
  await initAuth()
  addEventListener('hashchange', render)
  document.body.classList.toggle('rm', !!O.rm)

  // Direct pathname /verification support
  if (location.pathname === '/verification' || location.pathname.endsWith('/verification')) {
    location.hash = '#/app/verification'
  }

  render()
}
