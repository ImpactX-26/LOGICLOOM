# VOLCANO ZERO

AI-powered volcano investigation and response: a command-center UI with a live 3D
island simulation and a scripted agentic-AI scenario (Vite + React host, three.js).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint     # catches undefined names across modules
```

Requires Node 18+. No API keys or environment variables are needed.

## Structure

```
index.html              Vite entry (mounts #app)
src/main.jsx            React entry
src/App.jsx             React host component; starts the application
src/styles/main.css     Design system (glassmorphism, tokens, layout)
src/core/data.js        Constants, sensor metadata, shared state (S, V, hooks)
src/core/world.js       Island height function, drone motion, camera state
src/core/sim.js         Agentic scenario engine (ev, run)
src/scene/volcanoScene.js  three.js 3D world, picking, render loop
src/ui/panels.js        Sensor rows, sparklines, timeline, map overlays
src/pages/views.js      Landing, auth, dashboard and app pages, reports
src/app/router.js       Hash router, events, top bar, start()
```

## Demo

Open the dashboard and press **Start volcano scenario**. The agents, timeline,
hypotheses, risk zones, drone route and telemetry all update from one shared state.

## Important: simulated data

Sensor values and the scenario are simulated in `src/core`. Login only validates the
form format (no backend). To connect real data, replace the simulated updates in
`src/core/data.js` (`fresh`) and the tick in `src/app/router.js` (the `setInterval`),
and feed real events into `ev()` in `src/core/sim.js`.

Google/GitHub sign-in buttons are disabled until an auth provider is connected.
