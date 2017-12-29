import * as THREE from 'three'

import SimpleVechicle from './SimpleVechicle'

const OrbitControls = require('three-orbit-controls')(THREE)

const quaternion = new THREE.Quaternion()
quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI / 2)
const vehicle = new SimpleVechicle(5, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0.1, 0.3, quaternion)

export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.add(vehicle.mesh)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 75

const controls = new OrbitControls(camera)
const target = new THREE.Vector3(0, 0, 0)
let targetAngle = 0
let targetDir = 5
function animate () {
  target.x += targetDir
  if (target.x > 100 || target.x < -100) targetDir *= -1
  target.setY(50 * Math.sin(targetAngle))
  targetAngle += Math.PI / 180
  vehicle.seek(target)
  vehicle.update()
  controls.update()
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
