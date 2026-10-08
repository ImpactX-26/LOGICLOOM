import * as THREE from 'three'

let renderer, scene, camera, animId
let particles, lavaLight, droneMesh, satMesh
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0
let isRunning = false

export function initAuth3D(containerEl) {
  if (isRunning || !containerEl) return
  isRunning = true

  const width = containerEl.clientWidth || window.innerWidth
  const height = containerEl.clientHeight || window.innerHeight

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(width, height)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  containerEl.innerHTML = ''
  containerEl.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.inset = '0'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.pointerEvents = 'none'

  // Scene & Fog
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050a16)
  scene.fog = new THREE.FogExp2(0x060c1c, 0.012)

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 400)
  camera.position.set(0, 18, 55)

  // Ambient & Directional Lights
  const hemi = new THREE.HemisphereLight(0x4a6fa5, 0x080f1d, 0.6)
  scene.add(hemi)

  const moon = new THREE.DirectionalLight(0xa5c4ff, 0.8)
  moon.position.set(-30, 40, 20)
  scene.add(moon)

  // Lava Crater Light
  lavaLight = new THREE.PointLight(0xff551c, 3.2, 50)
  lavaLight.position.set(6, 14, -5)
  scene.add(lavaLight)

  // Procedural Volcanic Mountain Terrain
  const segs = 64
  const geo = new THREE.PlaneGeometry(120, 120, segs, segs)
  geo.rotateX(-Math.PI / 2)

  const pos = geo.attributes.position
  const colors = []
  const colA = new THREE.Color(0x090f1a) // dark base rock
  const colB = new THREE.Color(0x181214) // ash flank
  const colC = new THREE.Color(0x38120d) // summit lava rock

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)

    // Center of volcanic cone at (6, -5)
    const dx = x - 6
    const dz = z - (-5)
    const dist = Math.hypot(dx, dz)

    // Steep cone
    let h = Math.max(0, 24 * Math.exp(-Math.pow(dist / 14, 1.4)))

    // Crater indentation at peak
    if (dist < 4.5) {
      h -= (4.5 - dist) * 1.8
    }

    // Rocky ridges
    h += Math.sin(x * 0.35) * Math.cos(z * 0.3) * 1.6
    h += Math.sin(x * 0.8 + z * 0.6) * 0.5

    // Sea level base
    if (dist > 38) {
      h *= Math.max(0, 1 - (dist - 38) / 15)
    }

    pos.setY(i, Math.max(-0.5, h))

    // Vertex coloring
    const normH = Math.min(1, Math.max(0, h / 22))
    const c = colA.clone().lerp(colB, normH * 0.7).lerp(colC, normH > 0.7 ? (normH - 0.7) / 0.3 : 0)
    colors.push(c.r, c.g, c.b)
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0.1
  })
  const mountain = new THREE.Mesh(geo, mat)
  scene.add(mountain)

  // Ocean Water Plane
  const waterGeo = new THREE.PlaneGeometry(240, 240)
  waterGeo.rotateX(-Math.PI / 2)
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x061122,
    roughness: 0.25,
    metalness: 0.35,
    transparent: true,
    opacity: 0.95
  })
  const ocean = new THREE.Mesh(waterGeo, waterMat)
  ocean.position.y = 0.1
  scene.add(ocean)

  // Glowing Lava Disk inside crater
  const lavaDiskGeo = new THREE.CircleGeometry(3.6, 24)
  lavaDiskGeo.rotateX(-Math.PI / 2)
  const lavaMat = new THREE.MeshBasicMaterial({
    color: 0xff4d14
  })
  const lavaDisk = new THREE.Mesh(lavaDiskGeo, lavaMat)
  lavaDisk.position.set(6, 13.5, -5)
  scene.add(lavaDisk)

  // Floating Ember / Spark Particles
  const pCount = 200
  const pGeo = new THREE.BufferGeometry()
  const pPos = new Float32Array(pCount * 3)
  const pScales = new Float32Array(pCount)
  const pVels = []

  for (let i = 0; i < pCount; i++) {
    pPos[i * 3 + 0] = 6 + (Math.random() - 0.5) * 8
    pPos[i * 3 + 1] = 13.5 + Math.random() * 16
    pPos[i * 3 + 2] = -5 + (Math.random() - 0.5) * 8
    pScales[i] = Math.random() * 2.5 + 0.5
    pVels.push({
      vx: (Math.random() - 0.4) * 0.04,
      vy: Math.random() * 0.08 + 0.03,
      vz: (Math.random() - 0.5) * 0.04,
      life: Math.random()
    })
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const pMat = new THREE.PointsMaterial({
    color: 0xffaa33,
    size: 0.6,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })
  particles = new THREE.Points(pGeo, pMat)
  particles.userData = { vels: pVels, pPos }
  scene.add(particles)

  // Distant 3D Drone Model
  droneMesh = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.2 })
  )
  droneMesh.add(body)
  const light = new THREE.Mesh(
    new THREE.SphereGeometry(0.12),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  )
  light.position.y = -0.15
  droneMesh.add(light)
  droneMesh.position.set(16, 22, 10)
  scene.add(droneMesh)

  // Orbiting Satellite in upper sky
  satMesh = new THREE.Group()
  const satBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 })
  )
  const solarPanel = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.04, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
  )
  satMesh.add(satBody, solarPanel)
  satMesh.position.set(-25, 34, -15)
  scene.add(satMesh)

  // Mouse Parallax Listener
  function onMouseMove(e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 8
    targetY = (e.clientY / window.innerHeight - 0.5) * 4
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  // Resize handler
  function onResize() {
    if (!renderer || !containerEl) return
    const w = containerEl.clientWidth || window.innerWidth
    const h = containerEl.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // Animation Loop
  let clock = new THREE.Clock()
  function animate() {
    if (!isRunning) return
    animId = requestAnimationFrame(animate)

    const dt = clock.getDelta()
    const time = clock.getElapsedTime()

    // Smooth camera parallax
    mouseX += (targetX - mouseX) * 0.04
    mouseY += (targetY - mouseY) * 0.04
    camera.position.x = mouseX
    camera.position.y = 18 - mouseY
    camera.lookAt(4, 12, -4)

    // Lava pulse
    lavaLight.intensity = 3.2 + Math.sin(time * 3.5) * 0.6 + Math.sin(time * 7) * 0.25

    // Embers update
    const pts = particles.userData.pPos
    const vels = particles.userData.vels
    for (let i = 0; i < pCount; i++) {
      vels[i].life += dt * 0.4
      pts[i * 3 + 0] += vels[i].vx + Math.sin(time + i) * 0.015
      pts[i * 3 + 1] += vels[i].vy
      pts[i * 3 + 2] += vels[i].vz

      if (pts[i * 3 + 1] > 32 || vels[i].life > 1) {
        pts[i * 3 + 0] = 6 + (Math.random() - 0.5) * 6
        pts[i * 3 + 1] = 13.5
        pts[i * 3 + 2] = -5 + (Math.random() - 0.5) * 6
        vels[i].life = 0
      }
    }
    particles.geometry.attributes.position.needsUpdate = true

    // Drone gentle hover
    droneMesh.position.y = 22 + Math.sin(time * 2) * 0.4
    droneMesh.position.x = 16 + Math.cos(time * 0.8) * 1.5
    droneMesh.rotation.y = time * 0.5

    // Satellite orbital sweep
    satMesh.position.x = Math.cos(time * 0.15) * 32
    satMesh.position.z = Math.sin(time * 0.15) * 20 - 15
    satMesh.rotation.y = time * 0.2

    renderer.render(scene, camera)
  }

  animate()

  // Return cleanup function
  return () => {
    isRunning = false
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    if (renderer && renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    if (renderer) renderer.dispose()
  }
}
