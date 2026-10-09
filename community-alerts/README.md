# Community Siren & Emergency Alert System (SIMULATED)

Self-contained feature folder. Nothing outside this folder was modified.
All data is simulated; no physical sirens, SMS/radio/push or real villagers are involved.

Run: `npm run dev` → open `/community-alerts/` — or standalone:
`npx vite --config community-alerts/vite.config.js`
Tests (no extra dependencies): `node --test community-alerts/tests/alertLogic.test.js`

| File | Purpose |
|---|---|
| `CommunityAlertsPage.js` | The page UI (banner, severity, siren controls, villages, instructions, history, acknowledgements) |
| `alertLogic.js` | Pure logic: severities, demo villages, reducer, acknowledgement tracking |
| `sirenEngine.js` | Browser-only Web Audio siren simulation |
| `appAdapter.js` | Read-only reader for existing app state (volcano name, authority, risk label) |
| `mount.js` / `main.js` / `index.html` | Mount helper and standalone entry |
| `community-alerts.css` | Styles, all scoped under `.ca-root` |
| `vite.config.js` | Optional standalone dev/build config |
| `tests/alertLogic.test.js` | 10 logic tests |
| `INTEGRATION.md` | The sidebar-button patch (not applied) |
