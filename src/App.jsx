import { useEffect } from 'react'
import { start } from './app/router.js'

// React hosts the VOLCANO ZERO application shell. The pages, the 3D
// simulation and the scenario engine live in ./app, ./pages, ./scene, ./core.
export default function App() {
  useEffect(() => {
    start()
  }, [])
  return <div id="root" />
}
