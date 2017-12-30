import * as THREE from 'three'

import SimpleVechicle from './SimpleVechicle'

const OrbitControls = require('three-orbit-controls')(THREE)

export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
const invisibleMaterial = new THREE.MeshBasicMaterial()
invisibleMaterial.visible = false
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
  invisibleMaterial
)
scene.add(plane)

const vehicles = []
for (let i = 0; i < 1000; i++) {
  const vehicle = new SimpleVechicle(
    Math.random() * 5 + 1,
    new THREE.Vector3(Math.random() * 100 - 50, Math.random() * 100 - 50, 0),
    new THREE.Vector3(0, 0, 0),
    Math.random() * 10,
    Math.random() * 5
  )
  vehicles.push(vehicle)
  scene.add(vehicle.mesh)
}

const ambientLight = new THREE.AmbientLight(0x0c0c0c)
ambientLight.intensity = 5
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-30, 60, 60)
spotLight.intensity = 1
spotLight.castShadow = true
scene.add(spotLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 75

const controls = new OrbitControls(camera)

const raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()

function onMouseMove (event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function animate () {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(plane)
  if (intersects.length) {
    const target = intersects[0].point
    vehicles.forEach((v: SimpleVechicle, i: number) => {
      if (v.position.distanceTo(target) > 30) {
        v.arrival(target, 25, 4, 0.1)
        // v.seek(target)
      } else {
        v.flee(target)
      }
    })
  }

  vehicles.forEach((vi: SimpleVechicle) => {
    let neighbors = [ ]
    for (let j = 0; j < vehicles.length; j++) {
      const vj = vehicles[j]
      if (vi.position.distanceTo(vj.position) <= 2) {
        neighbors.push(vj)
      }
    }
    vi.separate(neighbors, 2)
  })

  vehicles.forEach((v: SimpleVechicle) => v.update())
  controls.update()

  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

window.addEventListener('mousemove', onMouseMove, false)
