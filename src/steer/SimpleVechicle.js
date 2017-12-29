import * as THREE from 'three'

class SimpleVehicle {
  constructor (
    mass: number,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    maxForce: number,
    maxSpeed: number,
    orientation: THREE.Quaternion
  ) {
    this.mass = mass
    this.position = position
    this.velocity = velocity
    this.maxForce = maxForce
    this.maxSpeed = maxSpeed
    this.orientation = orientation
  }

  update (steeringDirection: THREE.Vector3) {
    console.log(steeringDirection)
  }
}

export default SimpleVehicle
