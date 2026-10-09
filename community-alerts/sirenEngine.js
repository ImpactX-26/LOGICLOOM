/**
 * Browser-only siren SIMULATION using the Web Audio API.
 * Produces a tone on THIS device's speakers only. It does not control any
 * physical siren or send any message anywhere.
 */
export function createSirenEngine() {
  const Ctx = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null
  let ctx = null, osc = null, master = null, timer = null
  let pattern = null, nextAt = 0, running = false
  let muted = false, volume = 0.3

  const targetGain = () => (muted ? 0 : volume * 0.5)

  function scheduleCycle(t) {
    const f = osc.frequency
    if (pattern.type === 'wail') {
      f.setValueAtTime(pattern.low, t)
      f.linearRampToValueAtTime(pattern.high, t + pattern.period / 2)
      f.linearRampToValueAtTime(pattern.low, t + pattern.period)
    } else {
      f.setValueAtTime(pattern.low, t)
      f.setValueAtTime(pattern.high, t + pattern.period / 2)
    }
  }

  function scheduleAhead() {
    if (!running) return
    const horizon = ctx.currentTime + 1.5
    while (nextAt < horizon) {
      scheduleCycle(nextAt)
      nextAt += pattern.period
    }
  }

  function applyGain() {
    if (ctx && master) master.gain.setTargetAtTime(targetGain(), ctx.currentTime, 0.02)
  }

  return {
    supported: !!Ctx,
    isRunning: () => running,

    start(p) {
      if (!Ctx || running) return false
      ctx = new Ctx()
      osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 1800
      master = ctx.createGain()
      master.gain.value = 0
      osc.connect(lp)
      lp.connect(master)
      master.connect(ctx.destination)
      pattern = p
      running = true
      nextAt = ctx.currentTime
      osc.start()
      ctx.resume && ctx.resume()
      scheduleAhead()
      timer = setInterval(scheduleAhead, 250)
      applyGain()
      return true
    },

    setPattern(p) {
      pattern = p
      if (!running) return
      osc.frequency.cancelScheduledValues(ctx.currentTime)
      nextAt = ctx.currentTime
      scheduleAhead()
    },

    setMuted(m) {
      muted = !!m
      applyGain()
    },

    setVolume(v) {
      volume = Math.min(1, Math.max(0, v))
      applyGain()
    },

    stop() {
      if (!running) return
      running = false
      clearInterval(timer)
      timer = null
      const c = ctx, o = osc, m = master
      ctx = osc = master = null
      try {
        m.gain.setTargetAtTime(0, c.currentTime, 0.02)
      } catch { /* ignore */ }
      setTimeout(() => {
        try { o.stop() } catch { /* ignore */ }
        try { c.close() } catch { /* ignore */ }
      }, 150)
    },
  }
}
