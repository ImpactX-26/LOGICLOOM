import { DASH, LAND, NAV, VIEWS, authH, MOUNTAIN_LOGO_SVG } from '../pages/views.js'
import { $, KEYS, META, NZ, O, RC, RK, S, U, UI, V, hooks } from '../core/data.js'
import { fillDash } from '../ui/panels.js'
import { initAuth3D } from '../scene/authScene.js'
import { initAuth, signInEmail, signUpEmail, triggerOAuth, clearSession } from '../core/auth.js'
import { run } from '../core/sim.js'

export let root, started = 0
let auth3dCleanup = null

export function shell(inner) {
  const page = V.page || 'dash'

  return `
    <div class="app-layout">
      <!-- TOP GLOBAL HEADER BAR (Matching Reference Image) -->
      <header class="top-header-bar">
        <div class="header-left-brand">
          <a class="header-brand-link" href="#/app/dash">
            <span class="header-volcano-icon">
              <svg viewBox="0 0 28 28" width="24" height="24">
                <path d="M4 24 L11 8 L14 12 L17 8 L24 24 Z" fill="#94a3b8"/>
                <path d="M12 10 L14 5 L16 10 Z" fill="#ff5247"/>
                <circle cx="14" cy="5" r="2.5" fill="#ff7a45"/>
              </svg>
            </span>
            <span class="header-brand-title">VOLCANO <span style="color:#ff5247">ZERO</span></span>
          </a>
          <span class="header-brand-divider"></span>
          <span class="header-brand-subtitle">Autonomous Investigation Under Uncertainty</span>
        </div>

        <div class="header-right-tools">
          <div class="system-status-pill">
            <span class="status-green-dot"></span>
            <span class="status-label-text">System Online</span>
          </div>

          <button class="header-bell-btn" onclick="location.hash='#/app/alerts'" title="Alerts &amp; Notifications">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span class="bell-red-badge" id="bell-badge-count">${S.al.length ? '●' : ''}</span>
          </button>

          <a class="header-user-profile-btn" href="#/app/profile">
            <div class="user-avatar-circle">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" alt="Shilpa P" class="user-avatar-img" onerror="this.style.display='none';this.parentElement.textContent='SP'" />
            </div>
            <span class="user-name-text">Shilpa P</span>
            <span class="user-chevron-icon">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </a>
        </div>
      </header>

      <!-- BODY: LEFT SIDEBAR + MAIN CONTENT -->
      <div class="app-body-container">
        <!-- LEFT SIDEBAR (Matching Reference Image) -->
        <aside class="left-sidebar">
          <nav class="sidebar-nav-menu">
            ${NAV.map(n => {
              const isActive = n[0] === page
              return `
                <a class="sidebar-nav-item ${isActive ? 'active' : ''}" href="#/app/${n[0]}">
                  <span class="nav-icon-span">${n[2]}</span>
                  <span class="nav-text-span">${n[1]}</span>
                </a>
              `
            }).join('')}
          </nav>

          <!-- SIDEBAR BOTTOM WATERMARK FOOTER -->
          <div class="sidebar-bottom-watermark">
            <div class="watermark-logo">
              ${MOUNTAIN_LOGO_SVG}
            </div>
            <div class="watermark-text-primary">Smarter Investigations.</div>
            <div class="watermark-text-secondary">Safer Tomorrow.</div>
          </div>
        </aside>

        <!-- MAIN SCROLLABLE VIEW -->
        <main class="main-content-viewport" id="main-scroll-pane">
          <div id="view">${inner}</div>
        </main>
      </div>
    </div>
  `
}

export function render() {
  const h = location.hash.slice(2).split('/')
  const a = h[0]

  // Cleanup 3D background if leaving auth/landing
  if (auth3dCleanup) {
    auth3dCleanup()
    auth3dCleanup = null
  }

  if (a === 'app') {
    const pageTarget = h[1] || 'dash'
    V.page = NAV.some(n => n[0] === pageTarget) || ['alerts', 'profile'].includes(pageTarget) ? pageTarget : 'dash'

    root.innerHTML = shell(
      V.page === 'dash' ? DASH :
      VIEWS[V.page] ? VIEWS[V.page]() :
      DASH
    )

    if (V.page === 'dash') {
      fillDash()
    }
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

  window.scrollTo(0, 0)
}

export function refresh() {
  if (V.page === 'dash') {
    fillDash()
  } else if (VIEWS[V.page] && location.hash.startsWith('#/app')) {
    const vEl = document.getElementById('view')
    if (vEl) vEl.innerHTML = VIEWS[V.page]()
  }
}

// Live simulation clock tick
setInterval(() => {
  V.CLK = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  for (const k of KEYS) {
    S.cur[k] += (S.tg[k] - S.cur[k]) * 0.4 + (Math.random() - 0.5) * NZ[k]
    S.h[k].push(S.cur[k])
    S.h[k].shift()
  }
  const clockEl = document.getElementById('dash-live-clock')
  if (clockEl) clockEl.textContent = V.CLK
}, 2000)

// Global click event handlers
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-maptype], [data-k], [data-oauth], [data-a], [data-demo], #btn-logout')
  if (!t) return

  // Map toggle [ Map ] vs [ Satellite ]
  if (t.dataset.maptype) {
    UI.mapType = t.dataset.maptype
    const mapBtn = document.getElementById('btn-switch-map')
    const satBtn = document.getElementById('btn-switch-sat')
    if (mapBtn && satBtn) {
      mapBtn.classList.toggle('active', UI.mapType === 'map')
      satBtn.classList.toggle('active', UI.mapType === 'satellite')
    }
    const imgEl = document.getElementById('island-img')
    if (imgEl) {
      imgEl.style.filter = UI.mapType === 'satellite' ? 'contrast(1.2) saturate(1.15) brightness(0.9)' : 'none'
    }
    return
  }

  // Click on sensor cards / pins
  if (t.dataset.k) {
    UI.sel = t.dataset.k
    location.hash = '#/app/sensors'
    return
  }

  // Demo trigger
  if (t.dataset.demo) {
    location.hash = '#/app/dash'
    setTimeout(run, 1000)
    return
  }

  // Logout
  if (t.id === 'btn-logout') {
    clearSession()
    location.hash = '#/'
    return
  }

  // OAuth buttons
  if (t.dataset.oauth) {
    const msg = $('#msg')
    if (msg) {
      msg.className = 'msg info'
      msg.innerHTML = `<span class="spn"></span> Connecting to ${t.dataset.oauth.toUpperCase()} OAuth...`
    }
    try {
      await triggerOAuth(t.dataset.oauth)
    } catch (err) {
      if (msg) {
        msg.className = 'msg er'
        msg.textContent = err.message
      }
    }
    return
  }

  // Auth password toggle
  if (t.dataset.a === 'pw' || t.dataset.a === 'pw2') {
    const inp = $(t.dataset.a === 'pw2' ? '#pw2' : '#pw')
    if (inp) {
      inp.type = inp.type === 'password' ? 'text' : 'password'
      t.textContent = inp.type === 'password' ? '👁' : '🔒'
    }
    return
  }

  // Auth form submit
  if (t.dataset.a === 'login' || t.dataset.a === 'signup') {
    const m = t.dataset.a
    const emInput = $('#em')
    const pwInput = $('#pw')
    const msg = $('#msg')
    if (!emInput || !pwInput || !msg) return

    const em = emInput.value.trim()
    const pw = pwInput.value
    if (m === 'signup' && !$('#nm').value.trim()) {
      msg.className = 'msg er'
      msg.textContent = 'Please enter your full name.'
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(em)) {
      msg.className = 'msg er'
      msg.textContent = 'Please enter a valid email address.'
      return
    }
    if (pw.length < 6) {
      msg.className = 'msg er'
      msg.textContent = 'Password must be at least 6 characters.'
      return
    }

    msg.className = 'msg info'
    msg.innerHTML = '<span class="spn"></span> Signing in...'
    try {
      if (m === 'signup') {
        await signUpEmail($('#nm').value.trim(), em, pw)
      } else {
        await signInEmail(em, pw)
      }
      msg.className = 'msg ok'
      msg.textContent = '✓ Welcome back. Redirecting...'
      setTimeout(() => location.hash = '#/app/dash', 500)
    } catch (err) {
      msg.className = 'msg er'
      msg.textContent = err.message || 'Authentication failed.'
    }
    return
  }
})

hooks.refresh = refresh

export async function start() {
  if (started) return
  started = 1
  root = $('#root')
  await initAuth()
  addEventListener('hashchange', render)
  render()
}
