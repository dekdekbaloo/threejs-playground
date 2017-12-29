import * as THREE from 'three'

import SimpleVehicle from './SimpleVechicle'

const simpleVechicle = new SimpleVehicle()
simpleVechicle.update(new THREE.Vector3(0, 0, 0))
export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const geometry = new THREE.PlaneGeometry(1, 1, 32)
const material = new THREE.MeshBasicMaterial({
  color: 'skyblue'
})
const plane = new THREE.Mesh(geometry, material)
plane.rotateY(0.5)
scene.add(plane)

camera.position.z = 5
function animate () {
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
