import React from 'react'
import { createRoot } from 'react-dom/client'
import CommunityAlertsPage from './CommunityAlertsPage.js'

/** Mounts the page into any container element. Returns an unmount function. */
export function mountCommunityAlerts(container) {
  const root = createRoot(container)
  root.render(React.createElement(CommunityAlertsPage))
  return () => root.unmount()
}
