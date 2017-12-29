import * as THREE from 'three'

const BASIS = {
  FORWARD: new THREE.Vector3(0, 1, 0),
  SIDE: new THREE.Vector3(1, 0, 0),
  UP: new THREE.Vector3(0, 0, 1)
}

class SimpleVehicle {
  constructor (
    mass: number,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    maxForce: number,
    maxSpeed: number,
    rotation: THREE.Quaternion
  ) {
    this.mass = mass
    this.position = position
    this.velocity = velocity
    this.maxForce = maxForce
    this.maxSpeed = maxSpeed
    this.orientation = {
      forward: BASIS.FORWARD.clone(),
      side: BASIS.SIDE.clone(),
      up: BASIS.UP.clone()
    }

    this.orientation.forward.applyQuaternion(rotation)
    this.orientation.side.applyQuaternion(rotation)
    this.orientation.up.applyQuaternion(rotation)

    this.createMesh()
  }

  createMesh () {
    const geometry = new THREE.ConeGeometry(1, 5, 20)
    geometry.rotateX(Math.PI / 2)
    const material = new THREE.MeshBasicMaterial({color: 'skyblue'})
    this.mesh = new THREE.Mesh(geometry, material)

    this.updateMesh()
  }

  seek (target: THREE.Vector3) {
    const desiredVelocity = target.clone().sub(this.position).normalize(this.maxSpeed)
    const steering = desiredVelocity.sub(this.velocity)
    this.steer(steering)
  }

  steer (steeringDirection: THREE.Vector3) {
    const steeringForce = steeringDirection.clone().clampLength(0, this.maxForce)
    const acceleration = steeringForce.divideScalar(this.mass)
    this.velocity.add(acceleration.clampLength(0, this.maxSpeed))
  }

  updateMesh () {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    this.mesh.lookAt(this.position.clone().add(this.orientation.forward))
  }

  update () {
    this.position.add(this.velocity)

    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    const newForward = this.velocity.clone().normalize()
    this.orientation.forward.set(newForward.x, newForward.y, newForward.z)

    this.updateMesh()
  }
}

export default SimpleVehicle
