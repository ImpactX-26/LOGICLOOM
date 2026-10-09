# Adding the "Community Alerts" sidebar button (NOT applied)

I checked the project for a way to register extra pages or nav items without editing
existing files. There isn't one:

- The sidebar is built in `src/app/router.js` (`shell()`) from the hard-coded `NAV` array in `src/pages/views.js`.
- `render()` in `router.js` picks the page from `VIEWS[...]` (also in `views.js`).
- There is no plugin API, no `import.meta.glob` discovery, and no config file for nav items.

So the sidebar button needs edits to two existing files. They were deliberately NOT made.

## Proposed patch (for you to review and apply yourself)

**1. `src/pages/views.js`** — add one NAV entry (before `settings`) and one VIEWS entry:

```js
['community', 'Community Alerts', alertIco()],      // inside NAV
```
```js
community: () => '<div id="community-alerts-root"></div>',   // inside VIEWS
```

**2. `src/app/router.js`** — three small edits:

```js
import { mountCommunityAlerts } from '../../community-alerts/mount.js'
let unmountCA = null
```
In `render()`, right after `tick2()` in the `a === 'app'` branch:
```js
if (unmountCA) { unmountCA(); unmountCA = null }
if (V.page === 'community') unmountCA = mountCommunityAlerts(document.getElementById('community-alerts-root'))
```
In `refresh()`, add `&& V.page !== 'community'` to the long `else if` condition, because
`refresh()` re-writes `#view` every 1.5 s and would otherwise destroy the page and stop the siren.

`NAV.some(...)` in `render()` already whitelists the new route automatically.

## Until then
Open the page directly: `npm run dev`, then visit `/community-alerts/` (keep the trailing slash).
