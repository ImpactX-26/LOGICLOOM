// Optional: lets you run/build ONLY this feature without touching the project's own vite.config.js.
//   npx vite --config community-alerts/vite.config.js
//   npx vite build --config community-alerts/vite.config.js   (outputs to community-alerts/dist)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: here,
  base: './',
  plugins: [react()],
  server: { fs: { allow: [path.resolve(here, '..')] } },
  build: { outDir: path.resolve(here, 'dist'), emptyOutDir: true },
})
