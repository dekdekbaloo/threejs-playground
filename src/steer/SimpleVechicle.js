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
    rotation?: THREE.Quaternion
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

    if (rotation) {
      this.orientation.forward.applyQuaternion(rotation)
      this.orientation.side.applyQuaternion(rotation)
      this.orientation.up.applyQuaternion(rotation)
    }

    this.createMesh()
  }

  createMesh () {
    const geometry = new THREE.ConeGeometry(0.25, 1, 32)
    geometry.rotateX(Math.PI / 2)
    geometry.rotateZ(Math.PI / 3)

    const material = new THREE.MeshLambertMaterial({ color: 'cyan' })
    this.mesh = new THREE.Mesh(geometry, material)

    this.updateMesh()
  }

  seek (target: THREE.Vector3) {
    const desiredVelocity = target.clone().sub(this.position).normalize(this.maxSpeed)
    const steering = desiredVelocity.sub(this.velocity)
    this.steer(steering)
  }

  flee (target: THREE.Vector3) {
    const desiredVelocity = target.clone().sub(this.position).normalize(this.maxSpeed)
    const steering = desiredVelocity.negate().sub(this.velocity)
    this.steer(steering)
  }

  arrival (target: THREE.Vector3, slowingDistance: number, stopRadius: number = 0, stopSpeed: number = 0) {
    const targetOffset = target.clone().sub(this.position)
    const distance = targetOffset.length()
    const rampedSpeed = this.maxSpeed * (distance / slowingDistance)
    const clippedSpeed = Math.min(rampedSpeed, this.maxSpeed)
    const desiredVelocity = targetOffset.multiplyScalar(clippedSpeed / distance)
    const steering = desiredVelocity.sub(this.velocity)
    if (distance <= stopRadius && desiredVelocity.length() <= stopSpeed) {
      this.velocity.set(0, 0, 0)
      return
    }
    this.steer(steering)
  }

  steer (steeringDirection: THREE.Vector3) {
    const angleDiff = steeringDirection.angleTo(this.orientation.forward)
    if (angleDiff > Math.PI / 2 && this.velocity.length() < 0.5) {
      steeringDirection.applyAxisAngle(this.orientation.up, -angleDiff * 0.2)
    }
    const steeringForce = steeringDirection.clone().clampLength(0, this.maxForce)
    const acceleration = steeringForce.divideScalar(this.mass)
    this.velocity.add(acceleration.clampLength(0, this.maxSpeed))
  }

  separate (neighbors, radius: number) {
    const repulsiveForce = neighbors.reduce((force: THREE.Vector3, neighbor: SimpleVehicle) => (
      force.add(this.position.clone().sub(neighbor.position))
    ), new THREE.Vector3(0, 0, 0))
    repulsiveForce.normalize().divideScalar(radius)
    const acceleration = repulsiveForce.divideScalar(this.mass)
    this.velocity.add(acceleration)
  }

  updateMesh () {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    this.mesh.up = this.orientation.up
    this.mesh.lookAt(this.position.clone().add(this.orientation.forward))
  }

  update () {
    this.position.add(this.velocity)

    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    if (this.velocity.lengthSq()) {
      const newForward = this.velocity.clone().normalize()
      const newSide = newForward.clone().cross(this.orientation.up)
      this.orientation.forward.set(newForward.x, newForward.y, newForward.z)
      this.orientation.side.set(newSide.x, newSide.y, newSide.z)
    }

    this.updateMesh()
  }
}

export default SimpleVehicle
